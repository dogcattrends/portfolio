import { defineConfig, devices } from "@playwright/test";

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./__tests__/e2e",
  
  /* Timeout para cada teste */
  timeout: 30 * 1000,
  
  /* Timeout para expects */
  expect: {
    timeout: 5000,
  },
  
  /* Executar testes em paralelo */
  fullyParallel: true,
  
  /* Falhar build em CI se testes ficarem marcados com .only */
  forbidOnly: !!process.env.CI,
  
  /* Retry em CI */
  retries: process.env.CI ? 2 : 0,
  
  /* Workers */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter */
  reporter: process.env.CI
    ? [["html"], ["github"]]
    : [["html"], ["list"]],
  
  /* Configurações compartilhadas */
  use: {
    /* URL base */
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    
    /* Trace apenas em falhas */
    trace: "on-first-retry",
    
    /* Screenshot em falhas */
    screenshot: "only-on-failure",
    
    /* Video em retry */
    video: "retain-on-failure",
  },

  /* Configurar projetos para browsers diferentes */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Mobile viewports */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  /* Servidor de desenvolvimento */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
