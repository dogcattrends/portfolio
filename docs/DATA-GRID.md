# DataGrid Component

Componente de tabela de dados com navegação por teclado, ordenação, filtros dinâmicos, exportação CSV e anúncios ARIA para acessibilidade.

## 📋 Características

- ✅ **Navegação por Teclado**: Arrow keys, Page Up/Down, Home/End, Ctrl+Home/End
- ✅ **Ativação por Enter**: Abre detalhe da linha focada
- ✅ **Ordenação**: Click em headers com indicadores visuais (ASC/DESC)
- ✅ **Filtros Dinâmicos**: Inputs por coluna com busca case-insensitive
- ✅ **Exportação CSV**: Download com escape de vírgulas e aspas
- ✅ **ARIA Live Region**: Anúncios de filtros, navegação e ações
- ✅ **Framer Motion**: Animações suaves em linhas filtradas
- ✅ **Acessibilidade**: WCAG 2.1 Level AA compliant

## 🎯 API

### Props

```typescript
interface DataGridProps<T> {
  /** Dados a serem exibidos */
  data: T[];
  /** Configuração das colunas */
  columns: DataGridColumn<T>[];
  /** Chave única para React key */
  rowKey: keyof T;
  /** Callback ao clicar em linha */
  onRowClick?: (row: T) => void;
  /** Callback ao pressionar Enter */
  onRowActivate?: (row: T) => void;
  /** Habilitar ordenação (default: true) */
  sortable?: boolean;
  /** Habilitar filtros (default: true) */
  filterable?: boolean;
  /** Habilitar exportação CSV (default: true) */
  exportable?: boolean;
  /** Label ARIA (default: "Tabela de dados") */
  ariaLabel?: string;
  /** Mensagem de tabela vazia */
  emptyMessage?: string;
  /** Classe CSS customizada */
  className?: string;
}
```

### Configuração de Colunas

```typescript
interface DataGridColumn<T> {
  /** Chave da propriedade no objeto */
  key: keyof T;
  /** Label do cabeçalho */
  label: string;
  /** Se coluna é ordenável (default: true) */
  sortable?: boolean;
  /** Se coluna é filtrável (default: true) */
  filterable?: boolean;
  /** Função de renderização customizada */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  /** Largura CSS (ex: "200px", "20%") */
  width?: string;
  /** Alinhamento do conteúdo */
  align?: "left" | "center" | "right";
}
```

## 💻 Uso Básico

### Exemplo Simples

```tsx
import { DataGrid } from "@/components/ui/data-grid";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bruno", email: "bruno@example.com", role: "User" },
];

const columns = [
  { key: "name", label: "Nome", sortable: true, filterable: true },
  { key: "email", label: "E-mail", sortable: true, filterable: true },
  { key: "role", label: "Função", sortable: true, filterable: true },
];

export default function UsersPage() {
  return (
    <DataGrid
      data={users}
      columns={columns}
      rowKey="id"
      ariaLabel="Tabela de usuários"
    />
  );
}
```

### Com Callbacks

```tsx
import { useState } from "react";
import { DataGrid } from "@/components/ui/data-grid";
import { UserDetailDialog } from "@/components/user-detail-dialog";

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <DataGrid
        data={users}
        columns={columns}
        rowKey="id"
        onRowClick={(user) => console.log("Clicked:", user)}
        onRowActivate={(user) => setSelectedUser(user)} // Enter abre detalhe
        ariaLabel="Tabela de usuários"
      />

      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
```

### Renderização Customizada

```tsx
const columns = [
  { key: "name", label: "Nome" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={
          value === "active"
            ? "text-green-600 font-semibold"
            : "text-gray-400"
        }
      >
        {value === "active" ? "● Ativo" : "○ Inativo"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Criado em",
    render: (value) => new Date(value).toLocaleDateString("pt-BR"),
  },
  {
    key: "salary",
    label: "Salário",
    align: "right",
    render: (value) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value),
  },
];
```

### Desabilitar Recursos

```tsx
<DataGrid
  data={users}
  columns={columns}
  rowKey="id"
  sortable={false}      // Sem ordenação
  filterable={false}    // Sem filtros
  exportable={false}    // Sem botão CSV
/>
```

## ⌨️ Navegação por Teclado

### Atalhos Disponíveis

| Tecla                | Ação                                                 |
| -------------------- | ---------------------------------------------------- |
| `Tab`                | Foca no grid                                         |
| `↓` Arrow Down       | Move para linha abaixo                               |
| `↑` Arrow Up         | Move para linha acima                                |
| `→` Arrow Right      | Move para coluna à direita                           |
| `←` Arrow Left       | Move para coluna à esquerda                          |
| `Page Down`          | Move 10 linhas para baixo                            |
| `Page Up`            | Move 10 linhas para cima                             |
| `Home`               | Move para primeira coluna da linha atual             |
| `End`                | Move para última coluna da linha atual               |
| `Ctrl + Home`        | Move para primeira célula (linha 1, coluna 1)        |
| `Ctrl + End`         | Move para última célula (última linha/coluna)        |
| `Enter`              | Chama `onRowActivate` (abrir detalhe)                |
| `Space`              | Chama `onRowClick`                                   |

### Indicadores Visuais

- **Linha Focada**: Background azul claro (`bg-blue-100`) com borda azul (`ring-2 ring-blue-500`)
- **Célula Focada**: Texto em negrito (`font-semibold`)
- **Hover**: Background azul suave (`hover:bg-blue-50`)
- **Atributo ARIA**: `aria-selected="true"` na linha focada

### Exemplo de Uso

```tsx
<DataGrid
  data={projects}
  columns={projectColumns}
  rowKey="id"
  onRowActivate={(project) => {
    // Enter abre modal de detalhe
    setSelectedProject(project);
    setDetailModalOpen(true);
  }}
  onRowClick={(project) => {
    // Space ou click marca como selecionado
    setSelectedProjects((prev) =>
      prev.includes(project.id)
        ? prev.filter((id) => id !== project.id)
        : [...prev, project.id]
    );
  }}
/>
```

## 🔊 Anúncios ARIA Live

### Eventos Anunciados

1. **Filtros Aplicados**
   ```
   "Filtro aplicado. 3 resultados encontrados."
   "Filtros removidos. 10 itens exibidos."
   ```

2. **Navegação por Linha**
   ```
   "Linha 1 de 10. Nome: Alice Silva"
   "Linha 5 de 10. Nome: Elisa Rocha"
   ```

3. **Exportação CSV**
   ```
   "Arquivo CSV exportado com 10 linhas."
   ```

### Implementação

```tsx
{/* ARIA Live Region (invisible) */}
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {announceMessage}
</div>
```

## 📊 Ordenação

### Comportamento

- **1º Click**: Ordena ASC (crescente)
- **2º Click**: Ordena DESC (decrescente)
- **3º Click**: Remove ordenação (ordem original)

### Indicadores

- **Ícone**: `ChevronDown` rotaciona 180° quando ASC
- **ARIA**: `aria-sort="ascending"` | `"descending"` | `"none"`

### Ordenação Numérica vs String

```typescript
// String: localeCompare
String(aValue).localeCompare(String(bValue))

// Número: subtração
aValue - bValue
```

## 🔍 Filtros

### Características

- **Case-insensitive**: "ALICE" encontra "alice"
- **Busca parcial**: "ali" encontra "Alice Silva"
- **Múltiplos filtros**: AND lógico entre colunas
- **Tempo real**: Filtra enquanto digita

### Limpar Filtros

Botão aparece quando há filtros ativos:

```tsx
<button onClick={handleClearFilters}>
  Limpar filtros (2)
</button>
```

### Contadores

```tsx
// Footer
"Exibindo 3 de 10 itens"
"2 filtros ativos"
```

## 📥 Exportação CSV

### Formato

```csv
Nome,Idade,E-mail,Status
Alice Silva,28,alice@example.com,active
Bruno Costa,35,bruno@example.com,active
```

### Escape de Caracteres

```typescript
// Vírgula
"Silva, João" → "\"Silva, João\""

// Aspas duplas
Project "Alpha" → "\"Project \"\"Alpha\"\"\""
```

### Dados Exportados

- **Apenas dados visíveis**: Respeita filtros e ordenação
- **Valores renderizados**: Se coluna tem `render()`, usa valor bruto
- **Headers traduzidos**: Usa `column.label`

### Customização

```tsx
const handleCustomExport = () => {
  handleExport({
    filename: "relatorio-usuarios-2024",
    columns: ["name", "email"], // Apenas estas colunas
  });
};
```

## 🧪 Testes

### Executar Testes

```bash
# Testes de componente (120+ asserções)
npm test -- data-grid.test.tsx

# Testes de relatórios (50+ asserções)
npm test -- data-grid-reports.test.tsx
```

### Cobertura de Testes

#### `data-grid.test.tsx` (120+ testes)

- **Render**: 5 testes
  - Renderiza tabela, headers, células
  - Mensagem de vazio
  - Contagem de itens

- **Ordenação**: 6 testes
  - ASC, DESC, remoção de sort
  - aria-sort states
  - Ordenação por tipo (string, número)

- **Filtros**: 8 testes
  - Filtro único, múltiplos filtros
  - Case-insensitive
  - Botão limpar filtros
  - Anúncios ARIA

- **Navegação por Teclado**: 15 testes
  - Todas as teclas (arrows, Page Up/Down, Home/End, Ctrl+Home/End)
  - Enter/Space callbacks
  - Limites (não navega além da primeira/última linha)
  - aria-selected
  - Scroll into view

- **Click Interaction**: 2 testes
  - onRowClick callback
  - Focus em linha

- **Exportação CSV**: 4 testes
  - Botão visível/invisível
  - aria-label descritivo

- **Acessibilidade**: 6 testes
  - Sem violações axe
  - role=region
  - aria-live region
  - Labels em filtros
  - tabindex
  - aria-rowindex

- **Custom Render**: 1 teste

#### `data-grid-reports.test.tsx` (50+ testes)

- **Quantidade Correta**: 5 testes
  - 10 projetos renderizados
  - Contagem no footer
  - Contagem após filtro
  - Zero resultados
  - Múltiplos filtros

- **Ordenação**: 5 testes
  - Alfabética ASC/DESC
  - Por data
  - Manter ordenação após filtro
  - Remover ordenação

- **Exportação CSV**: 10 testes
  - Headers corretos
  - 10 linhas de dados
  - Escape vírgulas
  - Escape aspas duplas
  - Nome de arquivo
  - Tipo de Blob
  - Revoke URL
  - Anúncio ARIA
  - Exportar dados filtrados
  - Exportar dados ordenados

- **Skills Dataset**: 3 testes
  - 10 skills renderizadas
  - Filtro por categoria
  - Ordenação numérica (nível, anos)

## 📚 Exemplos Avançados

### Com Dataset de Testes

```tsx
import { testDatasets } from "@/lib/test-factories";
import { DataGrid } from "@/components/ui/data-grid";

const projectColumns = [
  { key: "title", label: "Título", sortable: true, filterable: true },
  { key: "status", label: "Status", sortable: true, filterable: true },
  {
    key: "startDate",
    label: "Data Início",
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString("pt-BR"),
  },
  {
    key: "technologies",
    label: "Tecnologias",
    render: (value) => value.join(", "),
  },
];

export default function ProjectsReport() {
  return (
    <DataGrid
      data={testDatasets.projects} // 10 projetos com estados extremos
      columns={projectColumns}
      rowKey="id"
      ariaLabel="Relatório de Projetos"
    />
  );
}
```

### Grid Responsivo

```tsx
<div className="w-full overflow-x-auto">
  <DataGrid
    data={data}
    columns={columns}
    rowKey="id"
    className="min-w-[800px]" // Força largura mínima
  />
</div>
```

### Com Loading State

```tsx
function ProjectsGrid() {
  const { data, isLoading } = useQuery("projects", fetchProjects);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <DataGrid
      data={data ?? []}
      columns={projectColumns}
      rowKey="id"
      emptyMessage="Nenhum projeto encontrado"
    />
  );
}
```

### Colunas com Largura Fixa

```tsx
const columns = [
  { key: "id", label: "ID", width: "80px", align: "center" },
  { key: "name", label: "Nome", width: "200px" },
  { key: "email", label: "E-mail", width: "250px" },
  { key: "status", label: "Status", width: "120px", align: "center" },
];
```

## ♿ Acessibilidade

### WCAG 2.1 Level AA

- ✅ **1.3.1 Info and Relationships**: Semântica correta com `<table>`, `role="region"`, `role="gridcell"`
- ✅ **2.1.1 Keyboard**: Navegação completa por teclado
- ✅ **2.4.3 Focus Order**: Ordem lógica (grid → filtros → botões)
- ✅ **2.4.7 Focus Visible**: Indicadores visuais claros (ring, background)
- ✅ **4.1.2 Name, Role, Value**: `aria-label`, `aria-sort`, `aria-selected`
- ✅ **4.1.3 Status Messages**: `aria-live="polite"` para anúncios

### Atributos ARIA

```tsx
<div
  role="region"
  aria-label="Tabela de usuários"
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  <table>
    <thead>
      <tr>
        <th>
          <button aria-sort="ascending">Nome</button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr aria-rowindex={2} aria-selected={true}>
        <td role="gridcell">Alice</td>
      </tr>
    </tbody>
  </table>
</div>

<div role="status" aria-live="polite" aria-atomic="true">
  Filtro aplicado. 3 resultados encontrados.
</div>
```

## 🎨 Customização de Estilos

### Tailwind Classes

```tsx
// Grid container
className="w-full space-y-4"

// Linha focada
className="bg-blue-100 ring-2 ring-inset ring-blue-500"

// Linha hover
className="hover:bg-blue-50"

// Célula focada
className="font-semibold"
```

### Tema Customizado

```tsx
<DataGrid
  data={data}
  columns={columns}
  rowKey="id"
  className="custom-grid"
/>
```

```css
/* globals.css */
.custom-grid table thead {
  @apply bg-purple-50;
}

.custom-grid table tbody tr:hover {
  @apply bg-purple-100;
}

.custom-grid table tbody tr[aria-selected="true"] {
  @apply bg-purple-200 ring-purple-500;
}
```

## 🚀 Performance

### Otimizações

- **React.useMemo**: Filtros e ordenação memoizados
- **React.useCallback**: Handlers estáveis
- **AnimatePresence**: Apenas linhas visíveis animadas
- **Map de Refs**: Scroll eficiente sem re-renders

### Grandes Datasets

```tsx
// Para > 1000 linhas, considere virtualização
import { useVirtualizer } from "@tanstack/react-virtual";

// Ou paginação server-side
<DataGrid
  data={data.slice(page * pageSize, (page + 1) * pageSize)}
  // ...
/>
```

## 📦 Dependências

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0"
  }
}
```

---

**Resumo**: DataGrid completo com navegação por teclado (arrows, Page Up/Down, Home/End, Enter), anúncios ARIA live, ordenação ASC/DESC, filtros dinâmicos, exportação CSV com escape, 170+ testes, WCAG 2.1 AA compliant.

