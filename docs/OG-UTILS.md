# Open Graph Utils

Utilities para construir metadata Open Graph otimizada com sanitização de texto e truncamento inteligente.

## Features

- ✅ Remove caracteres de controle (0x00-0x1F, 0x7F-0x9F)
- ✅ Normaliza espaços múltiplos
- ✅ Trunca em 60 chars (título) / 155 chars (descrição)
- ✅ Respeita palavras ao truncar
- ✅ Suporte a sufixos (site name)
- ✅ Validação de limites
- ✅ TypeScript strict
- ✅ 100% testado

## Uso Básico

### buildOpenGraphTitle

```typescript
import { buildOpenGraphTitle } from "@/lib/og-utils";

// Título simples
buildOpenGraphTitle("My Article Title");
// → "My Article Title"

// Com sufixo (site name)
buildOpenGraphTitle("Article", " | Blog");
// → "Article | Blog"

// Remove caracteres de controle
buildOpenGraphTitle("Title\nwith\x00control\tchars");
// → "Title with control chars"

// Trunca títulos longos
buildOpenGraphTitle("Very Long Title That Exceeds Sixty Character Limit");
// → "Very Long Title That Exceeds Sixty Character..."
```

### buildOpenGraphDescription

```typescript
import { buildOpenGraphDescription } from "@/lib/og-utils";

buildOpenGraphDescription("Short description");
// → "Short description"

// Trunca em 155 chars
buildOpenGraphDescription("A".repeat(200));
// → "AAA..." (155 chars)
```

### buildOpenGraphMetadata

```typescript
import { buildOpenGraphMetadata } from "@/lib/og-utils";

const metadata = buildOpenGraphMetadata({
  title: "Article Title",
  description: "Article description with details",
  url: "https://example.com/article",
  image: "https://example.com/og-image.jpg",
  type: "article",
  siteName: "My Blog",
});

console.log(metadata);
// {
//   title: "Article Title | My Blog",
//   description: "Article description with details",
//   url: "https://example.com/article",
//   image: "https://example.com/og-image.jpg",
//   type: "article",
//   siteName: "My Blog"
// }
```

## Uso com Next.js

### Metadata estática

```typescript
import type { Metadata } from "next";
import { buildOpenGraphMetadata } from "@/lib/og-utils";

export const metadata: Metadata = (() => {
  const ogData = buildOpenGraphMetadata({
    title: "Portfolio",
    description: "My professional portfolio",
    url: "https://portfolio.dev",
    image: "https://portfolio.dev/og.jpg",
    siteName: "Portfolio",
  });

  return {
    title: ogData.title,
    description: ogData.description,
    openGraph: {
      title: ogData.title,
      description: ogData.description,
      url: ogData.url,
      images: ogData.image ? [{ url: ogData.image }] : [],
      type: ogData.type,
    },
  };
})();
```

### Metadata dinâmica

```typescript
import type { Metadata } from "next";
import { buildOpenGraphMetadata } from "@/lib/og-utils";

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await fetchPost(params.slug);

  const ogData = buildOpenGraphMetadata({
    title: post.title,
    description: post.excerpt,
    url: `https://blog.dev/posts/${params.slug}`,
    image: post.coverImage,
    type: "article",
    siteName: "Blog",
  });

  return {
    title: ogData.title,
    description: ogData.description,
    openGraph: {
      title: ogData.title,
      description: ogData.description,
      url: ogData.url,
      images: [{ url: ogData.image! }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ogData.title,
      description: ogData.description,
      images: [ogData.image!],
    },
  };
}
```

## Validação

```typescript
import { isValidOGTitle, isValidOGDescription } from "@/lib/og-utils";

// Valida título
isValidOGTitle("Valid Title"); // true
isValidOGTitle(""); // false
isValidOGTitle("A".repeat(61)); // false

// Valida descrição
isValidOGDescription("Valid description"); // true
isValidOGDescription(""); // false
isValidOGDescription("A".repeat(156)); // false
```

## Constantes

```typescript
import { OG_LIMITS } from "@/lib/og-utils";

OG_LIMITS.TITLE_MAX; // 60
OG_LIMITS.DESCRIPTION_MAX; // 155
```

## Sanitização

A utility remove automaticamente:

- **Control characters:** 0x00-0x1F, 0x7F-0x9F
- **Line breaks:** `\n`, `\r`
- **Tabs:** `\t`
- **Null bytes:** `\x00`
- **Espaços múltiplos:** normalizados para um único

Exemplo:

```typescript
buildOpenGraphTitle("Title\nwith\x00many   \t  spaces\r");
// → "Title with many spaces"
```

## Truncamento Inteligente

Trunca respeitando palavras para evitar corte no meio:

```typescript
buildOpenGraphTitle("Word1 Word2 Word3 Word4 Word5 Word6 Word7 Word8 LongWord");
// → "Word1 Word2 Word3 Word4 Word5 Word6 Word7 Word8..."
// (não corta "LongWord" no meio)
```

## Testes

100% de cobertura com 47 testes unitários:

```bash
npm test og-utils
```

Testes cobrem:
- ✅ Remoção de control chars
- ✅ Normalização de espaços
- ✅ Truncamento respeitando palavras
- ✅ Sufixos e site names
- ✅ Casos extremos (vazio, Unicode, etc)
- ✅ Validação de limites
- ✅ Metadata completa

## API Completa

```typescript
// Build functions
buildOpenGraphTitle(title: string, suffix?: string): string
buildOpenGraphDescription(description: string): string
buildOpenGraphMetadata(data: OpenGraphMetadata): OpenGraphMetadata

// Validation
isValidOGTitle(title: string): boolean
isValidOGDescription(description: string): boolean

// Constants
OG_LIMITS.TITLE_MAX // 60
OG_LIMITS.DESCRIPTION_MAX // 155

// Types
interface OpenGraphMetadata {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article";
  siteName?: string;
}
```

## Boas Práticas

1. **Sempre use sufixo com site name:**
   ```typescript
   buildOpenGraphTitle(pageTitle, " | Site Name");
   ```

2. **Valide antes de usar:**
   ```typescript
   const title = buildOpenGraphTitle(input);
   if (!isValidOGTitle(title)) {
     // fallback
   }
   ```

3. **Sanitize user input:**
   ```typescript
   // Input de CMS/usuário pode conter control chars
   const safeTitle = buildOpenGraphTitle(userInput);
   ```

4. **Use buildOpenGraphMetadata para consistência:**
   ```typescript
   const ogData = buildOpenGraphMetadata({ ... });
   // Garante que título E descrição são sanitizados
   ```
