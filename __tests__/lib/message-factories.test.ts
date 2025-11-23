import { describe, it, expect } from "vitest";
import {
  createMessage,
  createConversation,
  createFullConversation,
  simulateMessageDelivery,
  simulateMessageRead,
  simulateMessageFailure,
} from "@/lib/message-factories";
import { MessageType, MessageStatus, MessageDirection } from "@/types/enums";

describe("Message Factories", () => {
  describe("createMessage", () => {
    it("cria mensagem com valores padrão", () => {
      const message = createMessage();

      expect(message.id).toBeTruthy();
      expect(message.conversationId).toBeTruthy();
      expect(message.type).toBe(MessageType.TEXT);
      expect(message.direction).toBe(MessageDirection.INCOMING);
      expect(message.status).toBe(MessageStatus.SENT);
      expect(message.content).toBeTruthy();
      expect(message.senderId).toBeTruthy();
      expect(message.senderName).toBeTruthy();
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it("cria mensagem com overrides", () => {
      const customContent = "Mensagem customizada";
      const message = createMessage({
        content: customContent,
        type: MessageType.IMAGE,
        direction: MessageDirection.OUTGOING,
      });

      expect(message.content).toBe(customContent);
      expect(message.type).toBe(MessageType.IMAGE);
      expect(message.direction).toBe(MessageDirection.OUTGOING);
    });

    it("cria mensagem de imagem com metadados", () => {
      const message = createMessage({
        type: MessageType.IMAGE,
        mediaUrl: "https://example.com/image.jpg",
        mediaMimeType: "image/jpeg",
        mediaSize: 150000,
        thumbnailUrl: "https://example.com/thumb.jpg",
      });

      expect(message.type).toBe(MessageType.IMAGE);
      expect(message.mediaUrl).toBe("https://example.com/image.jpg");
      expect(message.mediaMimeType).toBe("image/jpeg");
      expect(message.mediaSize).toBe(150000);
      expect(message.thumbnailUrl).toBe("https://example.com/thumb.jpg");
    });

    it("cria mensagem de áudio com duração", () => {
      const message = createMessage({
        type: MessageType.AUDIO,
        mediaUrl: "https://example.com/audio.mp3",
        mediaMimeType: "audio/mpeg",
        duration: 120,
      });

      expect(message.type).toBe(MessageType.AUDIO);
      expect(message.duration).toBe(120);
    });

    it("cria mensagem com reply", () => {
      const originalId = "123e4567-e89b-12d3-a456-426614174000";
      const message = createMessage({
        replyToId: originalId,
      });

      expect(message.replyToId).toBe(originalId);
    });

    it("cria mensagem com status delivered", () => {
      const now = new Date();
      const message = createMessage({
        status: MessageStatus.DELIVERED,
        deliveredAt: now,
      });

      expect(message.status).toBe(MessageStatus.DELIVERED);
      expect(message.deliveredAt).toBe(now);
    });

    it("cria mensagem com status read", () => {
      const now = new Date();
      const message = createMessage({
        status: MessageStatus.READ,
        deliveredAt: new Date(now.getTime() - 5000),
        readAt: now,
      });

      expect(message.status).toBe(MessageStatus.READ);
      expect(message.readAt).toBe(now);
    });
  });

  describe("createConversation", () => {
    it("cria conversa com valores padrão", () => {
      const conversation = createConversation();

      expect(conversation.id).toBeTruthy();
      expect(conversation.contactId).toBeTruthy();
      expect(conversation.contactName).toBeTruthy();
      expect(conversation.contactPhone).toMatch(/^\+55119\d{8}$/);
      expect(conversation.contactEmail).toContain("@email.com");
      expect(conversation.status).toBe("active");
      expect(conversation.unreadCount).toBe(0);
      expect(conversation.tags).toEqual([]);
    });

    it("cria conversa com overrides", () => {
      const customName = "João da Silva";
      const conversation = createConversation({
        contactName: customName,
        unreadCount: 5,
        tags: ["vip", "urgent"],
      });

      expect(conversation.contactName).toBe(customName);
      expect(conversation.unreadCount).toBe(5);
      expect(conversation.tags).toEqual(["vip", "urgent"]);
    });

    it("gera avatar URL com nome", () => {
      const name = "Maria Santos";
      const conversation = createConversation({
        contactName: name,
      });

      expect(conversation.contactAvatar).toContain("pravatar");
      expect(conversation.contactAvatar).toContain(name);
    });
  });

  describe("createFullConversation", () => {
    it("cria conversa com exatamente 20 mensagens", () => {
      const { conversation, messages } = createFullConversation();

      expect(messages).toHaveLength(20);
      expect(conversation).toBeTruthy();
    });

    it("mensagens estão em ordem cronológica", () => {
      const { messages } = createFullConversation();

      for (let i = 1; i < messages.length; i++) {
        expect(messages[i].timestamp.getTime()).toBeGreaterThanOrEqual(
          messages[i - 1].timestamp.getTime()
        );
      }
    });

    it("contém saudação como primeira mensagem", () => {
      const { messages } = createFullConversation();

      expect(messages[0].direction).toBe(MessageDirection.INCOMING);
      expect(messages[0].content.toLowerCase()).toMatch(/ol[aá]|oi|hey/);
    });

    it("contém pergunta sobre preço", () => {
      const { messages } = createFullConversation();

      const hasPriceQuestion = messages.some(
        (m) =>
          m.content.toLowerCase().includes("quanto") ||
          m.content.toLowerCase().includes("preço") ||
          m.content.toLowerCase().includes("valor")
      );

      expect(hasPriceQuestion).toBe(true);
    });

    it("contém pelo menos uma imagem", () => {
      const { messages } = createFullConversation();

      const hasImage = messages.some((m) => m.type === MessageType.IMAGE);
      expect(hasImage).toBe(true);
    });

    it("contém pelo menos um áudio", () => {
      const { messages } = createFullConversation();

      const hasAudio = messages.some((m) => m.type === MessageType.AUDIO);
      expect(hasAudio).toBe(true);
    });

    it("contém pelo menos um documento", () => {
      const { messages } = createFullConversation();

      const hasDocument = messages.some((m) => m.type === MessageType.DOCUMENT);
      expect(hasDocument).toBe(true);
    });

    it("todas mensagens pertencem à mesma conversa", () => {
      const { conversation, messages } = createFullConversation();

      messages.forEach((message) => {
        expect(message.conversationId).toBe(conversation.id);
      });
    });

    it("contém mensagens incoming e outgoing", () => {
      const { messages } = createFullConversation();

      const hasIncoming = messages.some((m) => m.direction === MessageDirection.INCOMING);
      const hasOutgoing = messages.some((m) => m.direction === MessageDirection.OUTGOING);

      expect(hasIncoming).toBe(true);
      expect(hasOutgoing).toBe(true);
    });

    it("mensagens têm status apropriados", () => {
      const { messages } = createFullConversation();

      const validStatuses = [
        MessageStatus.SENT,
        MessageStatus.DELIVERED,
        MessageStatus.READ,
      ];

      messages.forEach((message) => {
        expect(validStatuses).toContain(message.status);
      });
    });

    it("última mensagem atualiza conversa", () => {
      const { conversation, messages } = createFullConversation();

      expect(conversation.lastMessage).toBe(messages[messages.length - 1].content);
      expect(conversation.lastMessageAt).toEqual(messages[messages.length - 1].timestamp);
    });

    it("imagens têm thumbnails", () => {
      const { messages } = createFullConversation();

      const imageMessages = messages.filter((m) => m.type === MessageType.IMAGE);

      imageMessages.forEach((msg) => {
        expect(msg.thumbnailUrl).toBeTruthy();
        expect(msg.mediaUrl).toBeTruthy();
        expect(msg.mediaMimeType).toMatch(/^image\//);
      });
    });

    it("áudios têm duração", () => {
      const { messages } = createFullConversation();

      const audioMessages = messages.filter((m) => m.type === MessageType.AUDIO);

      audioMessages.forEach((msg) => {
        expect(msg.duration).toBeGreaterThan(0);
        expect(msg.mediaMimeType).toBe("audio/mpeg");
      });
    });

    it("documentos têm mimeType apropriado", () => {
      const { messages } = createFullConversation();

      const docMessages = messages.filter((m) => m.type === MessageType.DOCUMENT);

      docMessages.forEach((msg) => {
        expect(msg.mediaMimeType).toMatch(/^application\//);
        expect(msg.mediaSize).toBeGreaterThan(0);
      });
    });
  });

  describe("simulateMessageDelivery", () => {
    it("atualiza status para DELIVERED após delay", async () => {
      const message = createMessage({ status: MessageStatus.SENDING });

      const delivered = await simulateMessageDelivery(message, 100);

      expect(delivered.status).toBe(MessageStatus.DELIVERED);
      expect(delivered.deliveredAt).toBeInstanceOf(Date);
    });

    it("respeita delay customizado", async () => {
      const message = createMessage();
      const startTime = Date.now();

      await simulateMessageDelivery(message, 500);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(500);
    });

    it("usa delay padrão de 1000ms", async () => {
      const message = createMessage();
      const startTime = Date.now();

      await simulateMessageDelivery(message);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(1000);
    });
  });

  describe("simulateMessageRead", () => {
    it("atualiza status para READ após delay", async () => {
      const message = createMessage({ status: MessageStatus.DELIVERED });

      const read = await simulateMessageRead(message, 100);

      expect(read.status).toBe(MessageStatus.READ);
      expect(read.readAt).toBeInstanceOf(Date);
    });

    it("respeita delay customizado", async () => {
      const message = createMessage();
      const startTime = Date.now();

      await simulateMessageRead(message, 800);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(800);
    });
  });

  describe("simulateMessageFailure", () => {
    it("marca mensagem como FAILED", () => {
      const message = createMessage({ status: MessageStatus.SENDING });

      const failed = simulateMessageFailure(message);

      expect(failed.status).toBe(MessageStatus.FAILED);
    });

    it("adiciona metadata de erro", () => {
      const message = createMessage();

      const failed = simulateMessageFailure(message);

      expect(failed.metadata).toBeTruthy();
      expect(failed.metadata?.error).toBe("Network timeout");
      expect(failed.metadata?.failedAt).toBeInstanceOf(Date);
    });

    it("preserva metadata existente", () => {
      const message = createMessage({
        metadata: { customField: "value" },
      });

      const failed = simulateMessageFailure(message);

      expect(failed.metadata?.customField).toBe("value");
      expect(failed.metadata?.error).toBeTruthy();
    });
  });

  describe("Integração de Simulações", () => {
    it("simula fluxo completo: envio → entrega → leitura", async () => {
      let message = createMessage({
        status: MessageStatus.SENDING,
        direction: MessageDirection.OUTGOING,
      });

      expect(message.status).toBe(MessageStatus.SENDING);

      message = await simulateMessageDelivery(message, 50);
      expect(message.status).toBe(MessageStatus.DELIVERED);
      expect(message.deliveredAt).toBeTruthy();

      message = await simulateMessageRead(message, 50);
      expect(message.status).toBe(MessageStatus.READ);
      expect(message.readAt).toBeTruthy();
      expect(message.readAt!.getTime()).toBeGreaterThan(message.deliveredAt!.getTime());
    });

    it("simula falha no meio do fluxo", async () => {
      let message = createMessage({ status: MessageStatus.SENDING });

      // Simular que falhou antes de entregar
      message = simulateMessageFailure(message);

      expect(message.status).toBe(MessageStatus.FAILED);
      expect(message.deliveredAt).toBeUndefined();
      expect(message.readAt).toBeUndefined();
    });
  });
});
