# Composer Component

Compositor de mensagens com suporte a comandos slash (`/comando`) para templates rápidos.

## 📋 Características

- ✅ **Comandos Slash**: Digite `/` para ver templates disponíveis
- ✅ **Autocompletar**: Filtra templates enquanto digita
- ✅ **Navegação por Teclado**: ↑↓ para navegar, Enter/Tab para aplicar, Esc para fechar
- ✅ **Categorias**: Templates organizados (comum, técnico, comercial)
- ✅ **Preview**: Visualize conteúdo do template antes de aplicar
- ✅ **Textarea Auto-expand**: Ajusta altura automaticamente
- ✅ **Contador de Caracteres**: Aviso acima de 500 caracteres
- ✅ **ARIA Live**: Anúncios de sugestões disponíveis
- ✅ **Framer Motion**: Animações suaves nas sugestões

## 🎯 API

```typescript
interface ComposerProps {
  onSend: (message: string) => void;
  placeholder?: string;
  templates?: MessageTemplate[];
  isSending?: boolean;
  initialValue?: string;
  className?: string;
  ariaLabel?: string;
}

interface MessageTemplate {
  command: string;           // "saudacao"
  label: string;             // "Saudação"
  description: string;       // "Cumprimento inicial"
  content: string;           // "Olá! Como posso..."
  category?: "comum" | "tecnico" | "comercial";
}
```

## 💻 Uso Básico

```tsx
import { Composer } from "@/components/ui/composer";

export default function ChatPage() {
  const handleSend = (message: string) => {
    console.log("Enviando:", message);
    // API call aqui
  };

  return (
    <Composer
      onSend={handleSend}
      placeholder="Digite sua mensagem..."
    />
  );
}
```

## 📝 Templates Padrão

O componente vem com 8 templates pré-definidos:

1. `/saudacao` - "Olá! Como posso ajudá-lo hoje?"
2. `/agradecimento` - "Obrigado por entrar em contato!"
3. `/horario` - Informar horário de atendimento
4. `/portfolio` - Apresentar projetos
5. `/proposta` - Solicitar detalhes para proposta
6. `/stack` - Listar tecnologias
7. `/reuniao` - Agendar call
8. `/prazo` - Informar timeline

## 🎨 Templates Customizados

```tsx
const customTemplates = [
  {
    command: "boas-vindas",
    label: "Boas-Vindas",
    description: "Cumprimento para novos clientes",
    content: "Seja bem-vindo! Obrigado por escolher nossos serviços.",
    category: "comum",
  },
  {
    command: "bug-report",
    label: "Reportar Bug",
    description: "Template para bugs",
    content: "Por favor, descreva:\n1. O que aconteceu\n2. O que esperava\n3. Passos para reproduzir",
    category: "tecnico",
  },
];

<Composer
  onSend={handleSend}
  templates={customTemplates}
/>
```

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `/` | Abre menu de comandos |
| `↓` Arrow Down | Navega para próxima sugestão |
| `↑` Arrow Up | Navega para sugestão anterior |
| `Enter` | Aplica template selecionado (ou envia mensagem se não há sugestões) |
| `Tab` | Aplica template selecionado |
| `Esc` | Fecha menu de sugestões |
| `Shift+Enter` | Nova linha (não envia) |

## 🔊 ARIA Live Announcements

```tsx
{/* Anúncio automático */}
<div role="status" aria-live="polite">
  "3 sugestões disponíveis. Use setas para navegar..."
</div>
```

## 🧪 Testes (100+ asserções)

```bash
npm test -- composer.test.tsx
```

### Cobertura

- **Render**: textarea, botões, placeholder, contador
- **Comandos Slash**: detectar `/`, filtrar por comando/label, aplicar template
- **Navegação**: ArrowUp/Down, limites, hover, Escape
- **Envio**: click, Enter, Shift+Enter, trim, validação
- **Acessibilidade**: sem violações axe, ARIA labels, live regions

## 📊 Testes E2E (Webhook Flow)

```bash
npm run test:e2e
```

### Cenários Cobertos

1. **Receber Webhook → Exibir UI**
   - POST `/api/webhooks/messages`
   - Mensagem aparece com timestamp formatado
   - Status inicial: "received"

2. **Responder via Composer**
   - Click em mensagem abre composer
   - Usar comando `/saudacao`
   - Enviar resposta

3. **Atualizar Status → "sent"**
   - Status muda após envio
   - Persiste após reload
   - Erro → status "error"

4. **Fluxo Completo**
   - Webhook → UI → Responder → Status "sent"
   - Múltiplas conversas simultâneas

## 🚀 Exemplos Avançados

### Com Loading State

```tsx
const [isSending, setIsSending] = useState(false);

const handleSend = async (message: string) => {
  setIsSending(true);
  try {
    await api.sendMessage(message);
  } finally {
    setIsSending(false);
  }
};

<Composer
  onSend={handleSend}
  isSending={isSending}
/>
```

### Integração com Webhook

```tsx
"use client";

import { useState, useEffect } from "react";
import { Composer } from "@/components/ui/composer";

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Polling ou WebSocket para novos webhooks
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleReply = async (content: string) => {
    await fetch(`/api/messages/${selectedMessage.id}/reply`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    // Atualizar status para "sent"
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedMessage.id
          ? { ...msg, status: "sent" }
          : msg
      )
    );
  };

  return (
    <div>
      {/* Lista de mensagens */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          onClick={() => setSelectedMessage(msg)}
          data-testid={`message-${msg.id}`}
        >
          <p>{msg.message}</p>
          <span data-testid={`message-status-${msg.id}`}>
            {msg.status}
          </span>
        </div>
      ))}

      {/* Composer */}
      {selectedMessage && (
        <Composer onSend={handleReply} />
      )}
    </div>
  );
}
```

### Template com Placeholder

```tsx
{
  command: "reuniao",
  label: "Agendar Reunião",
  content: "Podemos agendar para [DIA] às [HORÁRIO]?",
}

// Usuário aplica template e preenche [DIA] e [HORÁRIO]
```

## ♿ Acessibilidade

- ✅ **Keyboard Navigation**: Todas ações via teclado
- ✅ **ARIA Labels**: `aria-label`, `aria-describedby`
- ✅ **ARIA Live Region**: Anúncios de sugestões
- ✅ **ARIA Attributes**: `role="listbox"`, `role="option"`, `aria-selected`
- ✅ **Focus Management**: Foca textarea após aplicar template
- ✅ **Semantic HTML**: `<form>`, `<button type="submit">`

## 🎨 Customização Visual

### Cores de Categoria

```tsx
const categoryColors = {
  comum: "bg-blue-50 text-blue-700",
  tecnico: "bg-purple-50 text-purple-700",
  comercial: "bg-green-50 text-green-700",
};
```

### Override de Estilos

```tsx
<Composer
  onSend={handleSend}
  className="max-w-2xl mx-auto"
/>
```

```css
/* globals.css */
[data-testid="composer-textarea"] {
  font-family: "Inter", sans-serif;
  font-size: 15px;
}

[data-testid="composer-suggestions"] {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}
```

---

**Resumo**: Compositor com comandos `/`, 8 templates padrão, navegação por teclado (↑↓ Enter Tab Esc), preview de conteúdo, 100+ testes unitários, testes E2E de webhook → UI → resposta → status "sent".
