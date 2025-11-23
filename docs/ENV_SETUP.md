# Configuração de Variáveis de Ambiente

Este projeto requer variáveis de ambiente para funcionar corretamente. Configure-as conforme o ambiente (local, preview, produção).

## Desenvolvimento Local

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase (client-side)
NEXT_PUBLIC_SUPABASE_URL=https://ptsveobymsavvxhxwerq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0c3Zlb2J5bXNhdnZ4aHh3ZXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTI5NjUsImV4cCI6MjA3ODQ2ODk2NX0.lerQpGCxdNK8I4FpYVJwq9VLdR7Xnu1a6_2n7cpfyHI

# Server-side
SUPABASE_URL=https://ptsveobymsavvxhxwerq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key

# Opcional: JWT Secret
SUPABASE_JWT_SECRET=BdE7zpHhf1EBxiSEzX4Ox2M6J8i8zlXXujxHUuTKmbhUQ8PW+xq9OXLoDwdnZxoC9AejeJaxgVD1qBlG1MMoqw==

# WhatsApp Business API (Opcional)
META_WABA_TOKEN=seu-meta-token
WABA_PHONE_ID=seu-phone-id
VERIFY_TOKEN=seu-verify-token
```

## Deploy na Vercel

### Via Dashboard

1. Importe o repositório: https://vercel.com/import
2. Vá em **Settings → Environment Variables**
3. Adicione cada variável conforme necessário:

#### Obrigatórias (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL` → `https://ptsveobymsavvxhxwerq.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → (obtenha no Dashboard do Supabase → Settings → API)
- `SUPABASE_URL` → `https://ptsveobymsavvxhxwerq.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` → (obtenha no Dashboard do Supabase → Settings → API)

#### Opcionais
- `SUPABASE_JWT_SECRET` → (se necessário validar tokens)
- `META_WABA_TOKEN`, `WABA_PHONE_ID`, `VERIFY_TOKEN` → (para WhatsApp Business)

### Via CLI

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Login
vercel login

# Link ao projeto
vercel link

# Adicione variáveis
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Deploy
vercel --prod
```

## GitHub Actions (CI)

Para rodar testes e Lighthouse no CI, adicione secrets no repositório:

1. Vá em **Settings → Secrets and variables → Actions**
2. Adicione:
   - `LHCI_GITHUB_APP_TOKEN` (opcional, para upload de relatórios Lighthouse)

## Obter Credenciais do Supabase

### Dashboard
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto (`ptsveobymsavvxhxwerq`)
3. Vá em **Settings → API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ sensível, só server)

### CLI
```bash
# Login
supabase login

# Link ao projeto
supabase link --project-ref ptsveobymsavvxhxwerq

# Ver configuração
supabase status
```

## Segurança

- ⚠️ **Nunca** commite `.env.local` (já está no `.gitignore`)
- ⚠️ **Nunca** exponha `SERVICE_ROLE_KEY` no client-side
- ✅ Use `NEXT_PUBLIC_*` apenas para variáveis públicas
- ✅ Rotacione chaves se vazarem

## Troubleshooting

### Erro: "SUPABASE_SERVICE_ROLE_KEY must be defined"
- Certifique-se de adicionar a variável no ambiente (Vercel/local)
- Reinicie o servidor após adicionar ao `.env.local`

### Erro: "Invalid API key"
- Verifique se copiou a chave correta do Dashboard
- Certifique-se de usar `anon` no client e `service_role` no server

### Rotas API retornam 500
- Verifique se todas as variáveis server-side estão configuradas
- Confira logs da Vercel ou terminal local
