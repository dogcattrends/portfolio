import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, type Browser, type Page } from "playwright";

/**
 * Webhook payload recebido
 */
interface WebhookPayload {
  id: string;
  from: string;
  message: string;
  timestamp: string;
}

/**
 * Status de mensagem
 */
type MessageStatus = "received" | "sent" | "error";

/**
 * Testes End-to-End: Webhook → UI → Response → Status
 * 
 * Fluxo completo:
 * 1. Servidor recebe webhook POST
 * 2. Mensagem aparece na UI
 * 3. Usuário responde via composer
 * 4. Status atualiza para "sent"
 */
describe("E2E - Webhook Flow", () => {
  let browser: Browser;
  let page: Page;
  const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";
  const API_URL = `${BASE_URL}/api`;

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: process.env.CI === "true",
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("Receber Webhook e Exibir na UI", () => {
    it("deve receber webhook e exibir mensagem na UI", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      // Simular webhook POST
      const webhookPayload: WebhookPayload = {
        id: "msg-001",
        from: "cliente@example.com",
        message: "Olá, gostaria de informações sobre seus serviços.",
        timestamp: new Date().toISOString(),
      };

      const response = await page.request.post(`${API_URL}/webhooks/messages`, {
        data: webhookPayload,
      });

      expect(response.ok()).toBe(true);

      // Aguardar mensagem aparecer na UI (polling ou websocket)
      await page.waitForSelector('[data-testid="message-msg-001"]', {
        timeout: 5000,
      });

      // Verificar conteúdo da mensagem
      const messageElement = page.locator('[data-testid="message-msg-001"]');
      await expect(messageElement).toContainText(
        "gostaria de informações sobre seus serviços"
      );

      // Verificar remetente
      const senderElement = page.locator('[data-testid="message-sender-msg-001"]');
      await expect(senderElement).toContainText("cliente@example.com");

      // Verificar status inicial
      const statusBadge = page.locator('[data-testid="message-status-msg-001"]');
      await expect(statusBadge).toContainText("received");

      await page.close();
    });

    it("deve exibir timestamp formatado", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      const webhookPayload: WebhookPayload = {
        id: "msg-002",
        from: "user@example.com",
        message: "Teste de timestamp",
        timestamp: "2024-01-15T14:30:00Z",
      };

      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: webhookPayload,
      });

      await page.waitForSelector('[data-testid="message-msg-002"]');

      const timestampElement = page.locator('[data-testid="message-timestamp-msg-002"]');
      
      // Timestamp deve estar em formato legível (ex: "14:30" ou "15/01/2024")
      const timestampText = await timestampElement.textContent();
      expect(timestampText).toMatch(/\d{1,2}:\d{2}|\d{2}\/\d{2}\/\d{4}/);

      await page.close();
    });

    it("deve exibir múltiplas mensagens em ordem cronológica", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      // Enviar 3 webhooks
      const messages = [
        {
          id: "msg-003",
          from: "user1@example.com",
          message: "Primeira mensagem",
          timestamp: "2024-01-15T10:00:00Z",
        },
        {
          id: "msg-004",
          from: "user2@example.com",
          message: "Segunda mensagem",
          timestamp: "2024-01-15T11:00:00Z",
        },
        {
          id: "msg-005",
          from: "user3@example.com",
          message: "Terceira mensagem",
          timestamp: "2024-01-15T12:00:00Z",
        },
      ];

      for (const msg of messages) {
        await page.request.post(`${API_URL}/webhooks/messages`, { data: msg });
      }

      // Aguardar todas as mensagens
      await page.waitForSelector('[data-testid="message-msg-005"]');

      // Verificar ordem
      const messageList = page.locator('[data-testid^="message-msg-"]');
      const count = await messageList.count();
      expect(count).toBeGreaterThanOrEqual(3);

      // Última mensagem deve ser msg-005 (mais recente)
      const lastMessage = messageList.last();
      await expect(lastMessage).toContainText("Terceira mensagem");

      await page.close();
    });

    it("deve atualizar UI em tempo real ao receber novo webhook", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      const initialCount = await page.locator('[data-testid^="message-"]').count();

      // Enviar novo webhook
      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-realtime-001",
          from: "realtime@example.com",
          message: "Mensagem em tempo real",
          timestamp: new Date().toISOString(),
        },
      });

      // UI deve atualizar automaticamente
      await page.waitForSelector('[data-testid="message-msg-realtime-001"]', {
        timeout: 3000,
      });

      const newCount = await page.locator('[data-testid^="message-"]').count();
      expect(newCount).toBe(initialCount + 1);

      await page.close();
    });
  });

  describe("Responder Mensagem via Composer", () => {
    it("deve responder mensagem usando composer", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      // Criar mensagem inicial
      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-reply-001",
          from: "customer@example.com",
          message: "Preciso de ajuda",
          timestamp: new Date().toISOString(),
        },
      });

      await page.waitForSelector('[data-testid="message-msg-reply-001"]');

      // Clicar na mensagem para abrir resposta
      await page.click('[data-testid="message-msg-reply-001"]');

      // Composer deve estar visível
      const composer = page.locator('[data-testid="composer-textarea"]');
      await expect(composer).toBeVisible();

      // Digitar resposta
      await composer.fill("Olá! Como posso ajudá-lo?");

      // Enviar
      await page.click('[data-testid="composer-send-button"]');

      // Verificar que resposta foi enviada
      await page.waitForSelector('[data-testid="reply-msg-reply-001"]', {
        timeout: 3000,
      });

      const reply = page.locator('[data-testid="reply-msg-reply-001"]');
      await expect(reply).toContainText("Como posso ajudá-lo?");

      await page.close();
    });

    it("deve usar comando slash no composer", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      // Criar mensagem
      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-slash-001",
          from: "user@example.com",
          message: "Olá",
          timestamp: new Date().toISOString(),
        },
      });

      await page.waitForSelector('[data-testid="message-msg-slash-001"]');
      await page.click('[data-testid="message-msg-slash-001"]');

      const composer = page.locator('[data-testid="composer-textarea"]');
      
      // Digitar comando slash
      await composer.fill("/saudacao");

      // Sugestões devem aparecer
      await page.waitForSelector('[data-testid="composer-suggestions"]');
      
      const suggestion = page.locator('[data-testid="suggestion-saudacao"]');
      await expect(suggestion).toBeVisible();

      // Selecionar sugestão
      await suggestion.click();

      // Template deve ser aplicado
      const composerValue = await composer.inputValue();
      expect(composerValue).toContain("Olá! Como posso ajudá-lo hoje?");

      await page.close();
    });

    it("deve navegar sugestões com teclado", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-keyboard-001",
          from: "user@example.com",
          message: "Test",
          timestamp: new Date().toISOString(),
        },
      });

      await page.waitForSelector('[data-testid="message-msg-keyboard-001"]');
      await page.click('[data-testid="message-msg-keyboard-001"]');

      const composer = page.locator('[data-testid="composer-textarea"]');
      await composer.fill("/");

      // Aguardar sugestões
      await page.waitForSelector('[data-testid="composer-suggestions"]');

      // Navegar com setas
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");

      // Verificar segunda sugestão selecionada
      const secondSuggestion = page.locator('[data-testid="suggestion-agradecimento"]');
      await expect(secondSuggestion).toHaveAttribute("aria-selected", "true");

      // Aplicar com Enter
      await page.keyboard.press("Enter");

      const composerValue = await composer.inputValue();
      expect(composerValue).toContain("Obrigado por entrar em contato");

      await page.close();
    });

    it("deve limpar composer após enviar", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-clear-001",
          from: "user@example.com",
          message: "Test",
          timestamp: new Date().toISOString(),
        },
      });

      await page.waitForSelector('[data-testid="message-msg-clear-001"]');
      await page.click('[data-testid="message-msg-clear-001"]');

      const composer = page.locator('[data-testid="composer-textarea"]');
      await composer.fill("Resposta de teste");
      await page.click('[data-testid="composer-send-button"]');

      // Composer deve limpar após envio
      await expect(composer).toHaveValue("");

      await page.close();
    });
  });

  describe("Atualização de Status", () => {
    it('deve mudar status de "received" para "sent" após responder', async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      // Criar mensagem
      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-status-001",
          from: "user@example.com",
          message: "Mensagem para testar status",
          timestamp: new Date().toISOString(),
        },
      });

      await page.waitForSelector('[data-testid="message-msg-status-001"]');

      // Status inicial: received
      const statusBadge = page.locator('[data-testid="message-status-msg-status-001"]');
      await expect(statusBadge).toContainText("received");

      // Responder
      await page.click('[data-testid="message-msg-status-001"]');
      const composer = page.locator('[data-testid="composer-textarea"]');
      await composer.fill("Resposta");
      await page.click('[data-testid="composer-send-button"]');

      // Aguardar atualização de status
      await page.waitForTimeout(500); // Esperar processamento

      // Status deve mudar para "sent"
      await expect(statusBadge).toContainText("sent");

      await page.close();
    });

    it("deve exibir indicador visual de status sent", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-visual-001",
          from: "user@example.com",
          message: "Test",
          timestamp: new Date().toISOString(),
        },
      });

      await page.waitForSelector('[data-testid="message-msg-visual-001"]');

      // Responder
      await page.click('[data-testid="message-msg-visual-001"]');
      const composer = page.locator('[data-testid="composer-textarea"]');
      await composer.fill("OK");
      await page.click('[data-testid="composer-send-button"]');

      await page.waitForTimeout(500);

      // Badge de status deve ter cor verde ou classe específica
      const statusBadge = page.locator('[data-testid="message-status-msg-visual-001"]');
      const badgeClass = await statusBadge.getAttribute("class");
      
      // Deve ter classe indicando sucesso (ex: bg-green, text-green)
      expect(badgeClass).toMatch(/green|success|sent/i);

      await page.close();
    });

    it("deve persistir status após reload da página", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-persist-001",
          from: "user@example.com",
          message: "Test persistence",
          timestamp: new Date().toISOString(),
        },
      });

      await page.waitForSelector('[data-testid="message-msg-persist-001"]');

      // Responder
      await page.click('[data-testid="message-msg-persist-001"]');
      const composer = page.locator('[data-testid="composer-textarea"]');
      await composer.fill("Resposta");
      await page.click('[data-testid="composer-send-button"]');

      await page.waitForTimeout(500);

      // Verificar status sent
      const statusBadge = page.locator('[data-testid="message-status-msg-persist-001"]');
      await expect(statusBadge).toContainText("sent");

      // Reload página
      await page.reload();

      // Aguardar mensagem reaparecer
      await page.waitForSelector('[data-testid="message-msg-persist-001"]');

      // Status deve continuar "sent"
      const statusAfterReload = page.locator(
        '[data-testid="message-status-msg-persist-001"]'
      );
      await expect(statusAfterReload).toContainText("sent");

      await page.close();
    });

    it('deve mostrar status "error" quando falha ao enviar', async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      await page.request.post(`${API_URL}/webhooks/messages`, {
        data: {
          id: "msg-error-001",
          from: "user@example.com",
          message: "Test",
          timestamp: new Date().toISOString(),
        },
      });

      await page.waitForSelector('[data-testid="message-msg-error-001"]');

      // Interceptar request para forçar erro
      await page.route(`${API_URL}/messages/*/reply`, (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: "Internal Server Error" }),
        });
      });

      // Tentar responder
      await page.click('[data-testid="message-msg-error-001"]');
      const composer = page.locator('[data-testid="composer-textarea"]');
      await composer.fill("Resposta");
      await page.click('[data-testid="composer-send-button"]');

      await page.waitForTimeout(500);

      // Status deve ser "error"
      const statusBadge = page.locator('[data-testid="message-status-msg-error-001"]');
      await expect(statusBadge).toContainText("error");

      await page.close();
    });
  });

  describe("Fluxo Completo E2E", () => {
    it("deve completar fluxo: webhook → visualizar → responder → status sent", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      // 1. Receber webhook
      const webhookPayload: WebhookPayload = {
        id: "msg-complete-001",
        from: "cliente-vip@example.com",
        message:
          "Olá, gostaria de contratar seus serviços para um projeto de e-commerce.",
        timestamp: new Date().toISOString(),
      };

      const webhookResponse = await page.request.post(
        `${API_URL}/webhooks/messages`,
        { data: webhookPayload }
      );
      expect(webhookResponse.ok()).toBe(true);

      // 2. Mensagem aparece na UI
      await page.waitForSelector('[data-testid="message-msg-complete-001"]', {
        timeout: 5000,
      });

      const message = page.locator('[data-testid="message-msg-complete-001"]');
      await expect(message).toContainText("projeto de e-commerce");

      // 3. Verificar status inicial "received"
      const statusBadge = page.locator(
        '[data-testid="message-status-msg-complete-001"]'
      );
      await expect(statusBadge).toContainText("received");

      // 4. Clicar para responder
      await message.click();

      // 5. Composer deve abrir
      const composer = page.locator('[data-testid="composer-textarea"]');
      await expect(composer).toBeVisible();
      await expect(composer).toBeFocused();

      // 6. Usar comando slash
      await composer.fill("/portfolio");
      await page.waitForSelector('[data-testid="composer-suggestions"]');
      
      const suggestion = page.locator('[data-testid="suggestion-portfolio"]');
      await suggestion.click();

      // 7. Adicionar texto personalizado
      const currentValue = await composer.inputValue();
      await composer.fill(
        currentValue + "\n\nPodemos agendar uma reunião esta semana?"
      );

      // 8. Enviar resposta
      await page.click('[data-testid="composer-send-button"]');

      // 9. Aguardar resposta aparecer
      await page.waitForSelector('[data-testid="reply-msg-complete-001"]', {
        timeout: 3000,
      });

      const reply = page.locator('[data-testid="reply-msg-complete-001"]');
      await expect(reply).toContainText("agendar uma reunião");

      // 10. Status deve mudar para "sent"
      await page.waitForTimeout(500);
      await expect(statusBadge).toContainText("sent");

      // 11. Composer deve estar limpo
      await expect(composer).toHaveValue("");

      // 12. Reload para verificar persistência
      await page.reload();
      await page.waitForSelector('[data-testid="message-msg-complete-001"]');

      const statusAfterReload = page.locator(
        '[data-testid="message-status-msg-complete-001"]'
      );
      await expect(statusAfterReload).toContainText("sent");

      await page.close();
    });

    it("deve lidar com múltiplas conversas simultaneamente", async () => {
      page = await browser.newPage();
      await page.goto(`${BASE_URL}/inbox`);

      // Criar 3 conversas
      const conversations = [
        { id: "msg-multi-001", from: "user1@example.com", message: "Pergunta 1" },
        { id: "msg-multi-002", from: "user2@example.com", message: "Pergunta 2" },
        { id: "msg-multi-003", from: "user3@example.com", message: "Pergunta 3" },
      ];

      for (const conv of conversations) {
        await page.request.post(`${API_URL}/webhooks/messages`, {
          data: { ...conv, timestamp: new Date().toISOString() },
        });
      }

      // Aguardar todas
      await page.waitForSelector('[data-testid="message-msg-multi-003"]');

      // Responder primeira conversa
      await page.click('[data-testid="message-msg-multi-001"]');
      let composer = page.locator('[data-testid="composer-textarea"]');
      await composer.fill("Resposta 1");
      await page.click('[data-testid="composer-send-button"]');

      // Verificar status
      await page.waitForTimeout(300);
      const status1 = page.locator('[data-testid="message-status-msg-multi-001"]');
      await expect(status1).toContainText("sent");

      // Responder terceira conversa
      await page.click('[data-testid="message-msg-multi-003"]');
      composer = page.locator('[data-testid="composer-textarea"]');
      await composer.fill("Resposta 3");
      await page.click('[data-testid="composer-send-button"]');

      await page.waitForTimeout(300);
      const status3 = page.locator('[data-testid="message-status-msg-multi-003"]');
      await expect(status3).toContainText("sent");

      // Segunda conversa deve continuar "received"
      const status2 = page.locator('[data-testid="message-status-msg-multi-002"]');
      await expect(status2).toContainText("received");

      await page.close();
    });
  });
});
