## 📝 Descrição

<!-- Descreva brevemente o que foi alterado e por quê -->

## 🔗 Issue Relacionada

<!-- Link para issue: Closes #123 ou Fixes #456 -->

## 🎯 Tipo de Mudança

- [ ] 🐛 Bug fix (correção não-breaking)
- [ ] ✨ Nova feature (funcionalidade não-breaking)
- [ ] 💥 Breaking change (correção ou feature que quebra funcionalidade existente)
- [ ] 📝 Documentação
- [ ] ♻️ Refatoração (sem mudança de funcionalidade)
- [ ] 🎨 UI/UX (mudanças visuais)
- [ ] ⚡ Performance
- [ ] ✅ Testes

## 🧪 Testes

- [ ] Testes unitários adicionados/atualizados
- [ ] Testes E2E adicionados/atualizados (se aplicável)
- [ ] Todos os testes passam (`npm test`)
- [ ] Testes E2E passam (`npm run test:e2e`)
- [ ] Cobertura de código mantida/aumentada

## ♿ Acessibilidade

- [ ] Sem violações axe-core
- [ ] Navegação por teclado funciona corretamente
- [ ] ARIA labels/roles apropriados
- [ ] Live regions para conteúdo dinâmico (se aplicável)
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Foco visível em elementos interativos
- [ ] Screen reader testado (NVDA/JAWS/VoiceOver)

## 📸 Screenshots/Gravações

<!-- Adicione prints ou GIFs demonstrando a mudança visual -->

### 🖼️ Antes
<!-- Screenshot do estado anterior -->

**Performance Metrics:**
| Métrica | Valor | Status |
|---------|-------|--------|
| LCP (Largest Contentful Paint) | 3.2s | 🔴 Precisa melhorar |
| FID (First Input Delay) | 180ms | 🟡 Precisa melhorar |
| CLS (Cumulative Layout Shift) | 0.18 | 🟡 Precisa melhorar |
| FCP (First Contentful Paint) | 2.1s | 🟡 Precisa melhorar |
| TBT (Total Blocking Time) | 420ms | 🔴 Precisa melhorar |
| Speed Index | 3.8s | 🟡 Precisa melhorar |

**Bundle Size:** 245 KB (gzipped: 78 KB)

### 🎉 Depois
<!-- Screenshot do novo estado -->

**Performance Metrics:**
| Métrica | Valor | Status |
|---------|-------|--------|
| LCP (Largest Contentful Paint) | 1.8s | 🟢 Bom |
| FID (First Input Delay) | 45ms | 🟢 Bom |
| CLS (Cumulative Layout Shift) | 0.05 | 🟢 Bom |
| FCP (First Contentful Paint) | 1.2s | 🟢 Bom |
| TBT (Total Blocking Time) | 120ms | 🟢 Bom |
| Speed Index | 2.1s | 🟢 Bom |

**Bundle Size:** 198 KB (gzipped: 62 KB)

**Melhorias:**
- ⚡ LCP: -43.75% (3.2s → 1.8s)
- ⚡ FID: -75% (180ms → 45ms)
- ⚡ CLS: -72.22% (0.18 → 0.05)
- 📦 Bundle: -19.18% (245KB → 198KB)

**Lighthouse Score:**
| Categoria | Antes | Depois | Melhoria |
|-----------|-------|--------|----------|
| Performance | ![62](https://img.shields.io/badge/62-orange) | ![94](https://img.shields.io/badge/94-brightgreen) | +32 pts |
| Accessibility | ![88](https://img.shields.io/badge/88-yellow) | ![100](https://img.shields.io/badge/100-brightgreen) | +12 pts |
| Best Practices | ![83](https://img.shields.io/badge/83-yellow) | ![100](https://img.shields.io/badge/100-brightgreen) | +17 pts |
| SEO | ![92](https://img.shields.io/badge/92-brightgreen) | ![100](https://img.shields.io/badge/100-brightgreen) | +8 pts |

### 📱 Mobile (se aplicável)
<!-- Screenshot em viewport mobile -->

**Performance Mobile:**
| Métrica | Valor | Status |
|---------|-------|--------|
| LCP | 2.3s | 🟢 Bom |
| FID | 65ms | 🟢 Bom |
| CLS | 0.08 | 🟢 Bom |
| Speed Index | 2.8s | 🟢 Bom |

**Lighthouse Mobile:** ![89](https://img.shields.io/badge/Performance-89-brightgreen)

## ⚠️ Riscos e Considerações

<!-- Liste possíveis impactos, efeitos colaterais ou áreas que necessitam atenção especial -->

- [ ] Mudança afeta performance (descreva impacto)
- [ ] Mudança afeta SEO (descreva impacto)
- [ ] Requer migração de dados
- [ ] Requer atualização de variáveis de ambiente
- [ ] Afeta múltiplos componentes/páginas

### Áreas de Risco
<!-- Ex: "Autenticação pode ser afetada", "Webhook pode falhar em produção" -->

## 🔍 Checklist de Revisão

- [ ] Código segue padrões do projeto (ESLint/Prettier)
- [ ] Comentários explicam o "porquê", não o "o quê"
- [ ] Sem `console.log` ou código de debug
- [ ] Sem código comentado desnecessário
- [ ] Nomes de variáveis/funções descritivos
- [ ] TypeScript strict mode sem erros
- [ ] Build de produção passa (`npm run build`)
- [ ] Componentes reutilizáveis quando possível
- [ ] Responsivo em desktop/tablet/mobile
- [ ] Testado em múltiplos navegadores (Chrome, Firefox, Safari)

## 📚 Documentação

- [ ] README atualizado (se necessário)
- [ ] CHANGELOG.md atualizado
- [ ] Comentários JSDoc em funções públicas
- [ ] Storybook stories adicionadas (se aplicável)
- [ ] Documentação de API atualizada (se aplicável)

## 🚀 Deploy Notes

<!-- Instruções especiais para deploy, migrations, etc. -->

## 👀 Notas para Revisores

<!-- Informações adicionais que ajudem na revisão -->
