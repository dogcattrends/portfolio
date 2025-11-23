# Acessibilidade - Checklist e Correções

## Componentes Criados

### 1. **Callout** (`components/ui/callout.tsx`)
Componente de alerta/banner com variantes e ARIA completo:
- ✅ `role="alert"` para anúncio de conteúdo
- ✅ `aria-live="polite"` (info/success) ou `"assertive"` (warning/error)
- ✅ `aria-atomic="true"` para leitura completa
- ✅ Ícones com `aria-hidden="true"`
- ✅ Botão de fechar com `aria-label="Fechar alerta"`
- ✅ Suporte a teclado (Enter/Space)

### 2. **BeforeAfter** (`components/ui/before-after.tsx`)
Comparação de imagens com slider acessível:
- ✅ Ambas imagens com `alt` descritivo
- ✅ `role="slider"` com `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- ✅ `aria-valuetext` descritivo ("50% antes, 50% depois")
- ✅ Navegação por teclado: ← → (1%), Shift+← → (10%), Home, End
- ✅ `tabIndex={0}` para foco
- ✅ `role="group"` com `aria-label` no container

## Testes Unitários

### **Callout Tests** (`__tests__/callout.test.tsx`)
- ✅ Render de todas as variants (default, info, success, warning, error)
- ✅ Roles: `role="alert"`, `aria-live`, `aria-atomic`
- ✅ Dismissible: botão de fechar com aria-label
- ✅ Keyboard: Enter/Space para fechar
- ✅ Callbacks: `onDismiss` chamado corretamente

### **BeforeAfter Tests** (`__tests__/before-after.test.tsx`)
- ✅ Render: ambas imagens, labels, slider
- ✅ Alt text: verificado em ambas imagens
- ✅ Roles: `role="slider"`, `aria-valuenow`, `aria-valuetext`
- ✅ Keyboard: ArrowLeft/Right (±1%), Shift (±10%), Home (0%), End (100%)
- ✅ Limites: não permite < 0 ou > 100
- ✅ Mouse/Touch: eventos de arrasto

## Avisos axe Saneados

### ✅ Alt Text em Imagens
**Antes:**
```tsx
<img src="/photo.jpg" />
```

**Depois:**
```tsx
// Imagem com conteúdo
<img src="/photo.jpg" alt="Descrição clara do conteúdo" />

// Imagem decorativa
<img src="/pattern.svg" alt="" aria-hidden="true" />
```

### ✅ Labels em Inputs
**Antes:**
```tsx
<input type="text" placeholder="Nome" />
```

**Depois:**
```tsx
// Com label visível
<label htmlFor={id}>Nome</label>
<input id={id} type="text" />

// Sem label visível
<input type="search" aria-label="Buscar projetos" />
```

### ✅ Heading Order
**Antes:**
```tsx
<h1>Título</h1>
<h3>Subseção</h3> {/* Pula h2 */}
```

**Depois:**
```tsx
<h1>Título da Página</h1>
<h2>Seção Principal</h2>
<h3>Subseção</h3>
```

### ✅ Botões com Ícones
**Antes:**
```tsx
<button><CloseIcon /></button>
```

**Depois:**
```tsx
// Com aria-label
<button aria-label="Fechar modal">
  <X aria-hidden="true" />
</button>

// Ou com texto oculto
<button>
  <MenuIcon aria-hidden="true" />
  <span className="sr-only">Abrir menu</span>
</button>
```

### ✅ Links Descritivos
**Antes:**
```tsx
<a href="/more">Clique aqui</a>
```

**Depois:**
```tsx
<a href="/projects">Ver todos os projetos</a>

// Link externo
<a href="https://..." target="_blank" rel="noopener noreferrer">
  Documentação
  <span className="sr-only">(abre em nova aba)</span>
</a>
```

## Utilitários Criados

### `lib/a11y-utils.ts`
```tsx
srOnly() // Classe para screen reader only
formatAriaLabel(text) // Normaliza texto para aria-label
generateId(prefix) // ID único para label/input association
iconButtonLabel(action, context) // Gera aria-label para botões
ariaLive.polite / assertive // Constantes tipadas
ariaRoles.alert / dialog / navigation // Roles tipadas
```

### `lib/a11y-checklist.ts`
Documentação completa de:
- Regras de imagens (alt text)
- Inputs e labels
- Heading order
- Botões acessíveis
- Links descritivos
- Contrast ratio
- ARIA live regions
- Foco visível

## Exemplos Práticos

### `components/examples/a11y-examples.tsx`
7 exemplos comentados:
1. Imagens (alt descritivo, decorativo)
2. Inputs (label, aria-label)
3. Headings (ordem correta)
4. Botões (texto, aria-label, sr-only)
5. Links (descritivos, externos)
6. Componentes customizados
7. Formulário completo acessível

## Próximos Passos

Para evitar regressões:
1. Execute `axe DevTools` após cada mudança
2. Teste com leitor de tela (NVDA/JAWS/VoiceOver)
3. Navegue apenas com teclado (Tab, Enter, Space, Arrows)
4. Verifique contrast ratio no Firefox DevTools
5. Adicione testes de a11y no CI/CD

## Resumo

- ✅ Callout component: 100% acessível
- ✅ BeforeAfter component: 100% acessível  
- ✅ Testes unitários completos (render, roles, keyboard)
- ✅ Documentação de avisos axe comuns
- ✅ Utilitários para facilitar desenvolvimento acessível
- ✅ Exemplos práticos de correções
