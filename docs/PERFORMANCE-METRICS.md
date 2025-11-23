# Como Reproduzir as Métricas dos Cases

Guia completo para medir e validar as métricas de performance reportadas nos case studies usando Lighthouse, Performance API e Web Vitals.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Lighthouse](#configuração-do-lighthouse)
3. [Medição de Core Web Vitals](#medição-de-core-web-vitals)
4. [Performance Marks Customizados](#performance-marks-customizados)
5. [Automatização com Lighthouse CI](#automatização-com-lighthouse-ci)
6. [Casos de Uso por Métrica](#casos-de-uso-por-métrica)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Software Necessário

```bash
# Node.js 18+ e npm
node --version  # v18.0.0+
npm --version   # 9.0.0+

# Lighthouse CLI
npm install -g lighthouse

# Chrome/Chromium atualizado
google-chrome --version  # 120.0+
```

### Extensões Recomendadas

- **Lighthouse** (DevTools integrado)
- **Web Vitals Extension** (Chrome Web Store)
- **PageSpeed Insights** (para comparação)

---

## ⚙️ Configuração do Lighthouse

### 1. Lighthouse Config Customizado

Crie `lighthouse.config.js` na raiz do projeto:

```javascript
// lighthouse.config.js
module.exports = {
  extends: 'lighthouse:default',
  
  settings: {
    // Configuração de rede
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024, // 10 Mbps
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    
    // Emulação de dispositivo
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    
    // User Agent
    emulatedUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    
    // Múltiplas execuções para média
    runs: 5,
    
    // Auditorias específicas
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    
    // Budget de performance
    budgets: [
      {
        resourceSizes: [
          { resourceType: 'script', budget: 300 },      // 300 KB
          { resourceType: 'stylesheet', budget: 50 },   // 50 KB
          { resourceType: 'image', budget: 500 },       // 500 KB
          { resourceType: 'total', budget: 1000 },      // 1 MB total
        ],
        resourceCounts: [
          { resourceType: 'third-party', budget: 10 },
          { resourceType: 'total', budget: 50 },
        ],
      },
    ],
  },
  
  // Auditorias customizadas
  audits: [
    'metrics/largest-contentful-paint',
    'metrics/cumulative-layout-shift',
    'metrics/first-input-delay',
    'metrics/first-contentful-paint',
    'metrics/total-blocking-time',
    'metrics/speed-index',
  ],
};
```

### 2. Lighthouse Mobile Config

Para testes mobile, crie `lighthouse.mobile.config.js`:

```javascript
// lighthouse.mobile.config.js
module.exports = {
  extends: 'lighthouse:default',
  
  settings: {
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 150,
      throughputKbps: 1.6 * 1024, // 1.6 Mbps (4G)
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1.6 * 1024,
      uploadThroughputKbps: 750,
    },
    
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 2.625,
      disabled: false,
    },
    
    emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5)',
    runs: 5,
  },
};
```

### 3. Executar Lighthouse

```bash
# Desktop
lighthouse https://seu-site.com \
  --config-path=./lighthouse.config.js \
  --output=json \
  --output=html \
  --output-path=./lighthouse-results/desktop

# Mobile
lighthouse https://seu-site.com \
  --config-path=./lighthouse.mobile.config.js \
  --output=json \
  --output=html \
  --output-path=./lighthouse-results/mobile

# Servidor local (desenvolvimento)
npm run dev &  # Inicia dev server
lighthouse http://localhost:3000 \
  --config-path=./lighthouse.config.js \
  --view  # Abre resultados automaticamente
```

---

## 📊 Medição de Core Web Vitals

### 1. LCP (Largest Contentful Paint)

**Objetivo:** < 2.5s (bom), 2.5s-4s (melhorar), > 4s (ruim)

#### Usando Performance API

```typescript
// lib/performance/web-vitals.ts
export function measureLCP(): Promise<number> {
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      
      console.log('LCP:', lastEntry.startTime, 'ms');
      resolve(lastEntry.startTime);
      
      observer.disconnect();
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  });
}

// Uso em componente
useEffect(() => {
  measureLCP().then((lcp) => {
    console.log(`LCP: ${lcp.toFixed(0)}ms`);
    
    // Enviar para analytics
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        name: 'LCP',
        value: lcp,
        metric_id: 'lcp',
        metric_value: lcp,
        metric_delta: lcp,
      });
    }
  });
}, []);
```

#### Lighthouse LCP

```bash
# Extrair LCP do report JSON
lighthouse https://seu-site.com --output=json | \
  jq '.audits["largest-contentful-paint"].numericValue'

# Exemplo: 1842 (1.842s)
```

### 2. CLS (Cumulative Layout Shift)

**Objetivo:** < 0.1 (bom), 0.1-0.25 (melhorar), > 0.25 (ruim)

#### Usando Performance API

```typescript
// lib/performance/web-vitals.ts
export function measureCLS(): Promise<number> {
  return new Promise((resolve) => {
    let clsValue = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // @ts-expect-error - LayoutShift type
        if (!entry.hadRecentInput) {
          // @ts-expect-error - LayoutShift value
          clsValue += entry.value;
        }
      }
      
      console.log('CLS:', clsValue.toFixed(3));
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    // Resolver após 5 segundos (ou quando usuário sai)
    setTimeout(() => {
      observer.disconnect();
      resolve(clsValue);
    }, 5000);
  });
}
```

#### Lighthouse CLS

```bash
lighthouse https://seu-site.com --output=json | \
  jq '.audits["cumulative-layout-shift"].numericValue'

# Exemplo: 0.052
```

### 3. FID/INP (First Input Delay / Interaction to Next Paint)

**FID Objetivo:** < 100ms (bom), 100ms-300ms (melhorar), > 300ms (ruim)  
**INP Objetivo:** < 200ms (bom), 200ms-500ms (melhorar), > 500ms (ruim)

#### Usando Performance API

```typescript
// lib/performance/web-vitals.ts
export function measureFID(): void {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // @ts-expect-error - FirstInput type
      const fid = entry.processingStart - entry.startTime;
      console.log('FID:', fid.toFixed(0), 'ms');
      
      // Analytics
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          name: 'FID',
          value: fid,
          metric_id: 'fid',
        });
      }
    }
    
    observer.disconnect();
  });
  
  observer.observe({ type: 'first-input', buffered: true });
}
```

#### Lighthouse TBT (Total Blocking Time)

FID não é mensurável em lab, use TBT como proxy:

```bash
lighthouse https://seu-site.com --output=json | \
  jq '.audits["total-blocking-time"].numericValue'

# TBT < 200ms geralmente resulta em FID < 100ms
```

---

## 🎯 Performance Marks Customizados

### 1. Marcar Eventos Importantes

```typescript
// app/layout.tsx ou componente crítico
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Marca quando layout está pronto
    performance.mark('layout-ready');
    
    // Mede tempo desde navegação
    performance.measure('time-to-layout', {
      start: 'navigationStart',
      end: 'layout-ready',
    });
    
    const measure = performance.getEntriesByName('time-to-layout')[0];
    console.log('Layout ready em:', measure.duration, 'ms');
  }, []);
  
  return children;
}
```

### 2. Marks para Componentes Críticos

```typescript
// components/ui/data-grid.tsx
export function DataGrid<T>({ data, columns }: DataGridProps<T>) {
  useEffect(() => {
    if (data.length > 0) {
      performance.mark('datagrid-data-loaded');
      performance.measure('datagrid-render-time', {
        start: 'datagrid-init',
        end: 'datagrid-data-loaded',
      });
      
      const measure = performance.getEntriesByName('datagrid-render-time')[0];
      console.log('DataGrid renderizado em:', measure.duration, 'ms');
    }
  }, [data]);
  
  useEffect(() => {
    performance.mark('datagrid-init');
  }, []);
  
  return (/* ... */);
}
```

### 3. Extrair Performance Marks

```typescript
// lib/performance/extract-marks.ts
export function getPerformanceReport() {
  const marks = performance.getEntriesByType('mark');
  const measures = performance.getEntriesByType('measure');
  
  return {
    marks: marks.map((m) => ({
      name: m.name,
      timestamp: m.startTime.toFixed(2),
    })),
    measures: measures.map((m) => ({
      name: m.name,
      duration: m.duration.toFixed(2),
      start: m.startTime.toFixed(2),
    })),
  };
}

// Console
console.table(getPerformanceReport().measures);
```

---

## 🤖 Automatização com Lighthouse CI

### 1. Instalação

```bash
npm install -D @lhci/cli
```

### 2. Configuração `lighthouserc.js`

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npm run start',
      url: ['http://localhost:3000', 'http://localhost:3000/showcase'],
      numberOfRuns: 5,
      settings: {
        preset: 'desktop',
        throttlingMethod: 'simulate',
      },
    },
    
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
      },
    },
    
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 3. Scripts `package.json`

```json
{
  "scripts": {
    "lhci:collect": "lhci collect",
    "lhci:assert": "lhci assert",
    "lhci:upload": "lhci upload",
    "lhci:all": "lhci collect && lhci assert && lhci upload"
  }
}
```

### 4. Executar

```bash
npm run lhci:all
```

---

## 📈 Casos de Uso por Métrica

### Case 1: LCP de 3.2s → 1.8s (-43.75%)

**Passos para Reproduzir:**

1. **Baseline (antes da otimização):**
   ```bash
   # Checkout do commit antes da otimização
   git checkout <commit-antes>
   npm run build
   
   # Executar Lighthouse
   lighthouse http://localhost:3000 \
     --config-path=./lighthouse.config.js \
     --output=json \
     --output-path=./results/before.json
   
   # Extrair LCP
   jq '.audits["largest-contentful-paint"].numericValue' results/before.json
   # Resultado: 3200 (3.2s)
   ```

2. **Depois da otimização:**
   ```bash
   git checkout <commit-depois>
   npm run build
   
   lighthouse http://localhost:3000 \
     --config-path=./lighthouse.config.js \
     --output=json \
     --output-path=./results/after.json
   
   jq '.audits["largest-contentful-paint"].numericValue' results/after.json
   # Resultado: 1800 (1.8s)
   ```

3. **Calcular melhoria:**
   ```bash
   # Delta: (3200 - 1800) / 3200 = 0.4375 = 43.75%
   ```

### Case 2: CLS de 0.18 → 0.05 (-72.22%)

**Passos para Reproduzir:**

1. **Medir com Performance Observer:**
   ```typescript
   // Adicionar no componente problemático
   useEffect(() => {
     measureCLS().then((cls) => {
       console.log('CLS:', cls.toFixed(3));
     });
   }, []);
   ```

2. **Lighthouse:**
   ```bash
   # Antes
   lighthouse http://localhost:3000 --output=json | \
     jq '.audits["cumulative-layout-shift"].numericValue'
   # Resultado: 0.18
   
   # Depois (com aspect-ratio em imagens)
   # Resultado: 0.05
   ```

### Case 3: Lighthouse Score 42 → 91 (+117%)

**Passos para Reproduzir:**

1. **Score completo:**
   ```bash
   # Antes
   lighthouse http://localhost:3000 --output=json | \
     jq '.categories.performance.score * 100'
   # Resultado: 42
   
   # Depois
   # Resultado: 91
   ```

2. **Delta:**
   ```bash
   # Melhoria: (91 - 42) / 42 = 1.166 = 117%
   ```

---

## 🔍 Troubleshooting

### Problema: Resultados Inconsistentes

**Solução:**
- Executar múltiplas vezes (5+) e usar mediana
- Desabilitar extensões do Chrome
- Fechar outros apps que consomem CPU/rede
- Usar modo `--throttling-method=provided` se tiver throttling real

### Problema: LCP Maior que Esperado

**Verificar:**
```bash
# Ver elemento LCP
lighthouse http://localhost:3000 --view | grep "largest-contentful-paint-element"

# Otimizações:
# - Preload da imagem LCP: <link rel="preload" as="image" href="hero.jpg">
# - Prioridade: fetchpriority="high"
# - Next.js Image com priority
```

### Problema: CLS Alto

**Diagnosticar:**
```typescript
// Detectar layout shifts
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Layout Shift:', entry);
    // @ts-expect-error
    console.log('Value:', entry.value);
    // @ts-expect-error
    console.log('Sources:', entry.sources);
  }
});
observer.observe({ type: 'layout-shift', buffered: true });
```

---

## 📚 Recursos Adicionais

- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**Última atualização:** 19 de novembro de 2025
