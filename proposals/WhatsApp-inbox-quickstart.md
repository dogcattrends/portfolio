# WhatsApp Inbox – Quickstart

## Problema típico
- Leads de mídia paga se perdem em múltiplos WhatsApp Web.
- Falta de rastreabilidade (LGPD) e filas despriorizadas.
- Mensagens sem padronização/tempo de resposta alto.

## Abordagem
1. **Webhook + normalização**: `/api/whatsapp` grava conversations/messages (RLS) e enriquece com tags.
2. **Inbox única**: lista não lida primeiro, handoff/assign, tags por conversa, timeline virtualizada.
3. **Templates + uploads**: respostas rápidas com IA/manual, upload inline e registro de eventos.
4. **Alertas**: toasts + som (respeita prefers-reduced-motion) para novas mensagens.

## Entregáveis
- Endpoint pronto para Meta Webhook (verify + payloads text/image/template).
- Inbox em `/inbox` com tags, handoff e composer com templates/upload.
- Relatório leve (CSV) com mensagens e tags.
- Guia LGPD + instruções de deploy (Vercel + Supabase).

## Checklist
- [ ] Webhook verificado e testado em sandbox
- [ ] Mensagens normalizadas e persistidas
- [ ] Inbox ordenando não lidas primeiro
- [ ] Handoff/assign funcional
- [ ] Export CSV habilitado

## Riscos
- Token/phone ID inválidos ou rate limits da Meta.
- Equipe sem processo de atendimento (resolve-se com playbook).
- Storage externo para mídia não incluído (usa links da Meta).

## Investimento (faixa)
- R$ 8k – 12k para quickstart (até 1 semana, sem customizações profundas).
