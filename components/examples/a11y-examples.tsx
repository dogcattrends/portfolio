/**
 * Exemplo de componentes com acessibilidade correta
 * Demonstra correções comuns de avisos do axe
 */

import * as React from "react";

import { BeforeAfter } from "@/components/ui/before-after";
import { Callout } from "@/components/ui/callout";

/**
 * Exemplo 1: Imagens com alt text apropriado
 */
export function ImagesExample(): React.JSX.Element {
  return (
    <div className="space-y-4">
      {/* ✅ Correto: alt descritivo */}
      <img
        src="/lighthouse-score.png"
        alt="Lighthouse score mostrando Performance 91/100, Accessibility 100/100"
        className="rounded-lg"
      />

      {/* ✅ Correto: imagem decorativa */}
      <img
        src="/pattern.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 opacity-5"
      />

      {/* ❌ Errado: sem alt
      <img src="/photo.jpg" />
      */}

      {/* ❌ Errado: alt genérico
      <img src="/chart.png" alt="Imagem" />
      */}
    </div>
  );
}

/**
 * Exemplo 2: Inputs com labels corretos
 */
export function InputsExample(): React.JSX.Element {
  const emailId = React.useId();
  const searchId = React.useId();

  return (
    <form className="space-y-4">
      {/* ✅ Correto: label associado via htmlFor/id */}
      <div>
        <label htmlFor={emailId} className="block text-sm font-medium">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          className="mt-1 block w-full rounded-md border"
          aria-required="true"
        />
      </div>

      {/* ✅ Correto: aria-label para input sem label visível */}
      <input
        id={searchId}
        type="search"
        aria-label="Buscar projetos"
        placeholder="Buscar..."
        className="w-full rounded-md border"
      />

      {/* ❌ Errado: input sem label
      <input type="text" placeholder="Nome" />
      */}
    </form>
  );
}

/**
 * Exemplo 3: Heading order correto
 */
export function HeadingsExample(): React.JSX.Element {
  return (
    <article>
      {/* ✅ Correto: ordem sequencial h1 -> h2 -> h3 */}
      <h1 className="text-4xl font-bold">Título da Página</h1>
      
      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Seção Principal</h2>
        
        <div className="mt-4">
          <h3 className="text-xl font-medium">Subseção</h3>
          <p>Conteúdo...</p>
        </div>
        
        <div className="mt-4">
          <h3 className="text-xl font-medium">Outra Subseção</h3>
          <p>Conteúdo...</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Outra Seção</h2>
        <p>Conteúdo...</p>
      </section>

      {/* ❌ Errado: pula de h1 para h3
      <h1>Título</h1>
      <h3>Subseção</h3>
      */}

      {/* ❌ Errado: múltiplos h1 na mesma página
      <h1>Primeiro Título</h1>
      <h1>Segundo Título</h1>
      */}
    </article>
  );
}

/**
 * Exemplo 4: Botões acessíveis
 */
export function ButtonsExample(): React.JSX.Element {
  return (
    <div className="flex gap-4">
      {/* ✅ Correto: botão com texto */}
      <button
        type="button"
        className="rounded-md bg-primary px-4 py-2 text-white"
      >
        Enviar Formulário
      </button>

      {/* ✅ Correto: botão de ícone com aria-label */}
      <button
        type="button"
        aria-label="Fechar modal"
        className="rounded-full p-2 hover:bg-gray-100"
      >
        <svg className="h-5 w-5" aria-hidden="true">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* ✅ Correto: botão com texto visualmente oculto */}
      <button type="button" className="rounded-full p-2">
        <svg className="h-5 w-5" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="sr-only">Abrir menu</span>
      </button>

      {/* ❌ Errado: botão de ícone sem label
      <button>
        <IconComponent />
      </button>
      */}
    </div>
  );
}

/**
 * Exemplo 5: Links descritivos
 */
export function LinksExample(): React.JSX.Element {
  return (
    <div className="space-y-2">
      {/* ✅ Correto: texto descritivo */}
      <a href="/projects" className="text-blue-600 hover:underline">
        Ver todos os projetos
      </a>

      {/* ✅ Correto: link externo com aviso */}
      <a
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Documentação oficial
        <span className="sr-only">(abre em nova aba)</span>
      </a>

      {/* ✅ Correto: link com contexto */}
      <p>
        Confira meu{" "}
        <a href="/case-study" className="text-blue-600 hover:underline">
          estudo de caso sobre performance
        </a>
      </p>

      {/* ❌ Errado: texto genérico
      <a href="/more">Clique aqui</a>
      <a href="/info">Saiba mais</a>
      */}
    </div>
  );
}

/**
 * Exemplo 6: Componentes customizados acessíveis
 */
export function ComponentsExample(): React.JSX.Element {
  return (
    <div className="space-y-8">
      {/* Callout com role e aria-live corretos */}
      <Callout variant="warning" title="Atenção">
        Este recurso está em fase beta
      </Callout>

      {/* BeforeAfter com alt text em ambas imagens */}
      <BeforeAfter
        beforeImage="/performance-before.jpg"
        afterImage="/performance-after.jpg"
        beforeAlt="Dashboard com Lighthouse score 42/100"
        afterAlt="Dashboard otimizado com Lighthouse score 91/100"
      />
    </div>
  );
}

/**
 * Exemplo 7: Formulário completo acessível
 */
export function FormExample(): React.JSX.Element {
  const nameId = React.useId();
  const emailId = React.useId();
  const messageId = React.useId();

  return (
    <form className="space-y-4" aria-labelledby="form-title">
      <h2 id="form-title" className="text-2xl font-bold">
        Entre em Contato
      </h2>

      <div>
        <label htmlFor={nameId} className="block text-sm font-medium">
          Nome <span className="text-red-600" aria-label="obrigatório">*</span>
        </label>
        <input
          id={nameId}
          type="text"
          required
          aria-required="true"
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium">
          Email <span className="text-red-600" aria-label="obrigatório">*</span>
        </label>
        <input
          id={emailId}
          type="email"
          required
          aria-required="true"
          aria-describedby={`${emailId}-hint`}
          className="mt-1 block w-full rounded-md border p-2"
        />
        <p id={`${emailId}-hint`} className="mt-1 text-sm text-gray-600">
          Nunca compartilharemos seu email
        </p>
      </div>

      <div>
        <label htmlFor={messageId} className="block text-sm font-medium">
          Mensagem
        </label>
        <textarea
          id={messageId}
          rows={4}
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/90"
      >
        Enviar Mensagem
      </button>
    </form>
  );
}
