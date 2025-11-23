import { randomUUID } from "crypto";

import type { Message, Conversation } from "@/lib/schemas";
import {
  MessageType,
  MessageStatus,
  MessageDirection,
} from "@/types/enums";

/**
 * Nomes brasileiros realistas
 */
const BRAZILIAN_NAMES = [
  "Ana Silva",
  "Carlos Santos",
  "Mariana Oliveira",
  "Rafael Costa",
  "Juliana Souza",
  "Lucas Pereira",
  "Fernanda Lima",
  "Bruno Alves",
  "Camila Rodrigues",
  "Pedro Martins",
  "Beatriz Carvalho",
  "Thiago Fernandes",
  "Amanda Ribeiro",
  "Gabriel Almeida",
  "Larissa Gomes",
  "Felipe Araújo",
  "Patricia Barbosa",
  "Rodrigo Dias",
  "Carolina Monteiro",
  "Leonardo Cardoso",
] as const;

/**
 * Mensagens de saudação
 */
const GREETING_MESSAGES = [
  "Olá! Tudo bem?",
  "Oi, como vai?",
  "Bom dia! 😊",
  "Boa tarde!",
  "E aí, tudo certo?",
  "Oi! Vi seu portfólio e adorei!",
  "Olá! Posso tirar uma dúvida?",
  "Hey! Tudo bem com você?",
  "Fala! Beleza?",
  "Bom dia! Podemos conversar?",
] as const;

/**
 * Mensagens sobre preço
 */
const PRICE_MESSAGES = [
  "Quanto você cobra por um projeto de e-commerce?",
  "Gostaria de saber valores para desenvolvimento de um app mobile",
  "Qual o orçamento para um site institucional?",
  "Você poderia me passar um orçamento para landing page?",
  "Quanto fica um projeto Next.js completo?",
  "Preciso de um MVP. Quanto custaria?",
  "Qual o valor médio para refatoração de código legacy?",
  "Você trabalha por hora ou por projeto? Quais os valores?",
  "Quanto seria para integrar uma API de pagamentos?",
  "Preço para consultoria de performance web?",
] as const;

/**
 * Perguntas técnicas
 */
const TECH_QUESTIONS = [
  "Você tem experiência com Next.js 14?",
  "Já trabalhou com GraphQL?",
  "Conhece React Native?",
  "Já fez integração com Stripe?",
  "Tem experiência com testes E2E?",
  "Trabalha com TypeScript strict mode?",
  "Conhece padrões de acessibilidade WCAG?",
  "Já otimizou Core Web Vitals?",
  "Tem experiência com CI/CD?",
  "Trabalha com Docker/Kubernetes?",
] as const;

/**
 * Mensagens de follow-up
 */
const FOLLOWUP_MESSAGES = [
  "Quando você teria disponibilidade?",
  "Podemos agendar uma call?",
  "Você está disponível para freela?",
  "Qual o prazo estimado?",
  "Tem portfólio com casos similares?",
  "Você fornece suporte após entrega?",
  "Trabalha com contratos mensais?",
  "Aceita pagamento parcelado?",
  "Tem disponibilidade imediata?",
  "Poderia enviar referências de clientes?",
] as const;

/**
 * Respostas automáticas
 */
const AUTO_RESPONSES = [
  "Obrigado pela mensagem! Vou responder em breve.",
  "Recebi sua mensagem. Retorno em até 24h!",
  "Olá! Vi sua mensagem e já vou preparar um orçamento.",
  "Oi! Obrigado pelo contato. Vamos conversar!",
  "Recebido! Vou analisar e te mando uma resposta detalhada.",
  "Muito obrigado! Já estou verificando sua solicitação.",
  "Oi! Que legal seu projeto. Vou preparar uma proposta.",
  "Mensagem recebida! Em breve te envio mais informações.",
  "Olá! Obrigado por entrar em contato. Vou te responder hoje.",
  "Recebi! Vou te mandar um retorno completo em breve.",
] as const;

/**
 * Factory para criar Message
 */
export function createMessage(overrides?: Partial<Message>): Message {
  const id = overrides?.id ?? randomUUID();
  const conversationId = overrides?.conversationId ?? randomUUID();
  const direction = overrides?.direction ?? MessageDirection.INCOMING;
  const type = overrides?.type ?? MessageType.TEXT;
  
  const senderName =
    overrides?.senderName ??
    BRAZILIAN_NAMES[Math.floor(Math.random() * BRAZILIAN_NAMES.length)];

  let content = overrides?.content;
  if (!content) {
    const rand = Math.random();
    if (rand < 0.3) {
      content = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
    } else if (rand < 0.6) {
      content = PRICE_MESSAGES[Math.floor(Math.random() * PRICE_MESSAGES.length)];
    } else {
      content = TECH_QUESTIONS[Math.floor(Math.random() * TECH_QUESTIONS.length)];
    }
  }

  return {
    id,
    conversationId,
    type,
    direction,
    status: overrides?.status ?? MessageStatus.SENT,
    content,
    senderId: overrides?.senderId ?? `user_${Math.random().toString(36).substr(2, 9)}`,
    senderName,
    senderAvatar: overrides?.senderAvatar ?? `https://i.pravatar.cc/150?u=${senderName}`,
    mediaUrl: overrides?.mediaUrl,
    mediaMimeType: overrides?.mediaMimeType,
    mediaSize: overrides?.mediaSize,
    thumbnailUrl: overrides?.thumbnailUrl,
    duration: overrides?.duration,
    latitude: overrides?.latitude,
    longitude: overrides?.longitude,
    replyToId: overrides?.replyToId,
    timestamp: overrides?.timestamp ?? new Date(),
    deliveredAt: overrides?.deliveredAt,
    readAt: overrides?.readAt,
    metadata: overrides?.metadata,
  };
}

/**
 * Factory para criar Conversation
 */
export function createConversation(overrides?: Partial<Conversation>): Conversation {
  const id = overrides?.id ?? randomUUID();
  const contactName =
    overrides?.contactName ??
    BRAZILIAN_NAMES[Math.floor(Math.random() * BRAZILIAN_NAMES.length)];

  return {
    id,
    contactId: overrides?.contactId ?? `contact_${Math.random().toString(36).substr(2, 9)}`,
    contactName,
    contactPhone: overrides?.contactPhone ?? `+55119${Math.floor(Math.random() * 100000000).toString().padStart(8, "0")}`,
    contactEmail: overrides?.contactEmail ?? `${contactName.toLowerCase().replace(/\s+/g, ".")}@email.com`,
    contactAvatar: overrides?.contactAvatar ?? `https://i.pravatar.cc/150?u=${contactName}`,
    lastMessage: overrides?.lastMessage ?? GREETING_MESSAGES[0],
    lastMessageAt: overrides?.lastMessageAt ?? new Date(),
    unreadCount: overrides?.unreadCount ?? 0,
    status: overrides?.status ?? "active",
    tags: overrides?.tags ?? [],
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
  };
}

/**
 * Gera uma conversa completa com 20 mensagens variadas
 */
export function createFullConversation(): {
  conversation: Conversation;
  messages: Message[];
} {
  const conversation = createConversation();
  const conversationId = conversation.id;
  const contactName = conversation.contactName;
  const senderId = conversation.contactId;

  const messages: Message[] = [];
  let currentTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 horas atrás

  // 1. Saudação inicial
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: GREETING_MESSAGES[0],
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 1000),
      readAt: new Date(currentTime.getTime() + 5000),
    })
  );

  currentTime = new Date(currentTime.getTime() + 30000); // +30s

  // 2. Apresentação
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: "Vi seu portfólio e fiquei muito impressionado com seus projetos!",
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 800),
      readAt: new Date(currentTime.getTime() + 4000),
    })
  );

  currentTime = new Date(currentTime.getTime() + 45000); // +45s

  // 3. Resposta automática
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.OUTGOING,
      senderName: "Você",
      senderId: "me",
      content: AUTO_RESPONSES[0],
      timestamp: currentTime,
      status: MessageStatus.DELIVERED,
      deliveredAt: new Date(currentTime.getTime() + 1200),
    })
  );

  currentTime = new Date(currentTime.getTime() + 60000); // +1min

  // 4. Pergunta sobre preço
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: PRICE_MESSAGES[0],
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 900),
      readAt: new Date(currentTime.getTime() + 3000),
    })
  );

  currentTime = new Date(currentTime.getTime() + 90000); // +1.5min

  // 5. Mais detalhes
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: "Preciso de um sistema com painel admin, integração com pagamentos e área de usuários.",
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 750),
      readAt: new Date(currentTime.getTime() + 2500),
    })
  );

  currentTime = new Date(currentTime.getTime() + 120000); // +2min

  // 6. Envio de foto (mockup)
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      type: MessageType.IMAGE,
      content: "Mockup inicial do projeto",
      mediaUrl: "https://placehold.co/800x600/4f46e5/ffffff?text=Mockup+do+Projeto",
      mediaMimeType: "image/png",
      mediaSize: 245680,
      thumbnailUrl: "https://placehold.co/200x150/4f46e5/ffffff?text=Mockup",
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 2000),
      readAt: new Date(currentTime.getTime() + 5000),
    })
  );

  currentTime = new Date(currentTime.getTime() + 180000); // +3min

  // 7. Resposta detalhada
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.OUTGOING,
      senderName: "Você",
      senderId: "me",
      content: "Ótimo! Vi o mockup. Para um projeto desse porte, precisaria de mais detalhes sobre:\n1. Número de usuários esperados\n2. Gateways de pagamento preferidos\n3. Prazo desejado",
      timestamp: currentTime,
      status: MessageStatus.DELIVERED,
      deliveredAt: new Date(currentTime.getTime() + 1500),
    })
  );

  currentTime = new Date(currentTime.getTime() + 150000); // +2.5min

  // 8. Resposta com detalhes
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: "Esperamos cerca de 5 mil usuários no primeiro mês. Gostaríamos de integrar com Stripe e PagSeguro. Prazo ideal seria 3 meses.",
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 1100),
      readAt: new Date(currentTime.getTime() + 4000),
    })
  );

  currentTime = new Date(currentTime.getTime() + 200000); // +3.3min

  // 9. Pergunta técnica
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: TECH_QUESTIONS[0],
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 850),
      readAt: new Date(currentTime.getTime() + 2800),
    })
  );

  currentTime = new Date(currentTime.getTime() + 120000); // +2min

  // 10. Confirmação técnica
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.OUTGOING,
      senderName: "Você",
      senderId: "me",
      content: "Sim! Tenho bastante experiência com Next.js 14, inclusive usando App Router e Server Components. Perfeito para esse projeto.",
      timestamp: currentTime,
      status: MessageStatus.DELIVERED,
      deliveredAt: new Date(currentTime.getTime() + 1300),
    })
  );

  currentTime = new Date(currentTime.getTime() + 180000); // +3min

  // 11. Áudio explicativo (simulado)
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.OUTGOING,
      senderName: "Você",
      senderId: "me",
      type: MessageType.AUDIO,
      content: "Áudio explicando arquitetura do projeto",
      mediaUrl: "https://example.com/audio/explanation.mp3",
      mediaMimeType: "audio/mpeg",
      mediaSize: 1254800,
      duration: 125, // 2min 5s
      timestamp: currentTime,
      status: MessageStatus.DELIVERED,
      deliveredAt: new Date(currentTime.getTime() + 3000),
    })
  );

  currentTime = new Date(currentTime.getTime() + 240000); // +4min

  // 12. Feedback do áudio
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: "Perfeito! Adorei a explicação. Ficou muito claro!",
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 950),
      readAt: new Date(currentTime.getTime() + 3200),
    })
  );

  currentTime = new Date(currentTime.getTime() + 300000); // +5min

  // 13. Documento com proposta
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.OUTGOING,
      senderName: "Você",
      senderId: "me",
      type: MessageType.DOCUMENT,
      content: "Proposta_Comercial_v1.pdf",
      mediaUrl: "https://example.com/docs/proposta.pdf",
      mediaMimeType: "application/pdf",
      mediaSize: 456200,
      timestamp: currentTime,
      status: MessageStatus.DELIVERED,
      deliveredAt: new Date(currentTime.getTime() + 1800),
    })
  );

  currentTime = new Date(currentTime.getTime() + 420000); // +7min

  // 14. Confirmação de recebimento
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: "Recebi o documento! Vou analisar com a equipe e te retorno.",
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 1050),
      readAt: new Date(currentTime.getTime() + 3500),
    })
  );

  currentTime = new Date(currentTime.getTime() + 600000); // +10min

  // 15. Follow-up sobre prazo
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: FOLLOWUP_MESSAGES[3],
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 900),
      readAt: new Date(currentTime.getTime() + 2900),
    })
  );

  currentTime = new Date(currentTime.getTime() + 180000); // +3min

  // 16. Resposta sobre timeline
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.OUTGOING,
      senderName: "Você",
      senderId: "me",
      content: "Com base no escopo, estimamos:\n• Sprint 1-4: MVP (30 dias)\n• Sprint 5-8: Features completas (30 dias)\n• Sprint 9-12: Testes e ajustes (30 dias)\n\nTotal: 3 meses conforme solicitado.",
      timestamp: currentTime,
      status: MessageStatus.DELIVERED,
      deliveredAt: new Date(currentTime.getTime() + 1600),
    })
  );

  currentTime = new Date(currentTime.getTime() + 480000); // +8min

  // 17. Imagem de referência
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      type: MessageType.IMAGE,
      content: "Exemplo de design que gostamos",
      mediaUrl: "https://placehold.co/1200x800/10b981/ffffff?text=Design+Referencia",
      mediaMimeType: "image/jpeg",
      mediaSize: 389400,
      thumbnailUrl: "https://placehold.co/200x150/10b981/ffffff?text=Design",
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 2200),
      readAt: new Date(currentTime.getTime() + 6000),
    })
  );

  currentTime = new Date(currentTime.getTime() + 240000); // +4min

  // 18. Comentário sobre design
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.OUTGOING,
      senderName: "Você",
      senderId: "me",
      content: "Ótima referência! Esse estilo moderno e clean combina perfeitamente com Next.js + Tailwind. Posso incorporar na proposta.",
      timestamp: currentTime,
      status: MessageStatus.DELIVERED,
      deliveredAt: new Date(currentTime.getTime() + 1400),
    })
  );

  currentTime = new Date(currentTime.getTime() + 180000); // +3min

  // 19. Mensagem de agendamento
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.INCOMING,
      senderName: contactName,
      senderId,
      content: FOLLOWUP_MESSAGES[1],
      timestamp: currentTime,
      status: MessageStatus.READ,
      deliveredAt: new Date(currentTime.getTime() + 1000),
      readAt: new Date(currentTime.getTime() + 3800),
    })
  );

  currentTime = new Date(currentTime.getTime() + 120000); // +2min

  // 20. Confirmação final
  messages.push(
    createMessage({
      conversationId,
      direction: MessageDirection.OUTGOING,
      senderName: "Você",
      senderId: "me",
      content: "Claro! Disponibilizo terça às 14h ou quinta às 10h. Qual funciona melhor?",
      timestamp: currentTime,
      status: MessageStatus.SENT,
      deliveredAt: new Date(currentTime.getTime() + 1500),
    })
  );

  // Atualizar conversa com última mensagem
  conversation.lastMessage = messages[messages.length - 1].content;
  conversation.lastMessageAt = messages[messages.length - 1].timestamp;
  conversation.unreadCount = 0;

  return { conversation, messages };
}

/**
 * Simula atrasos de entrega de mensagens (webhook)
 */
export function simulateMessageDelivery(
  message: Message,
  delayMs: number = 1000
): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedMessage: Message = {
        ...message,
        status: MessageStatus.DELIVERED,
        deliveredAt: new Date(),
      };
      resolve(updatedMessage);
    }, delayMs);
  });
}

/**
 * Simula leitura de mensagens
 */
export function simulateMessageRead(
  message: Message,
  delayMs: number = 3000
): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedMessage: Message = {
        ...message,
        status: MessageStatus.READ,
        readAt: new Date(),
      };
      resolve(updatedMessage);
    }, delayMs);
  });
}

/**
 * Simula falha no envio
 */
export function simulateMessageFailure(message: Message): Message {
  return {
    ...message,
    status: MessageStatus.FAILED,
    metadata: {
      ...message.metadata,
      error: "Network timeout",
      failedAt: new Date(),
    },
  };
}
