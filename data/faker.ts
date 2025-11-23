type PRNG = () => number;

function mulberry32(seed: number): PRNG {
  return function prng(): number {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let seedValue = 1337;
let random = mulberry32(seedValue);

export function setFakerSeed(seed: number): void {
  seedValue = seed;
  random = mulberry32(seedValue);
}

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pickOne<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

const partDescriptors = [
  'Módulo',
  'Kit',
  'Placa',
  'Sensor',
  'Controlador',
  'Gateway',
  'Cabeamento',
  'Adaptador',
] as const;

const partItems = [
  'telemetria',
  'energia',
  'rede LoRa',
  'RFID',
  'visão computacional',
  'edge AI',
  'automação pneumática',
  'IoT industrial',
] as const;

const whatsappOpeners = [
  'Bom dia',
  'Olá',
  'Boa tarde',
  'Oi time',
] as const;

const whatsappBodies = [
  'preciso confirmar o prazo de entrega do lote prioritário',
  'poderiam enviar o link de pagamento atualizado?',
  'há como liberar o handoff para o time comercial ainda hoje?',
  'estamos com dúvidas sobre a integração com o CRM, conseguem ajudar?',
];

const whatsappClosings = [
  'Obrigado!',
  'Podem me avisar assim que possível?',
  'Valeu pela força.',
  'Fico no aguardo.',
];

const croMetricDescriptors = [
  ['Conversão mobile', 'Conversão desktop'],
  ['Ticket médio', 'Tempo de checkout'],
  ['LCP médio', 'Taxa de abandono'],
] as const;

export function fakePartName(): string {
  return `${pickOne(partDescriptors)} de ${pickOne(partItems)}`;
}

let skuCounter = 1200;
export function fakeSku(prefix = 'SKU'): string {
  skuCounter += randomInt(3, 17);
  return `${prefix}-${skuCounter.toString().padStart(5, '0')}`;
}

export function fakeLocation(): { shelf: string; bay: string; label: string } {
  const shelf = `Prateleira ${String.fromCharCode(65 + randomInt(0, 5))}${randomInt(1, 20)}`;
  const bay = `Baia ${randomInt(1, 30)}`;
  return {
    shelf,
    bay,
    label: `${shelf} · ${bay}`,
  };
}

export function fakeWhatsappMessage(): string {
  return `${pickOne(whatsappOpeners)}, ${pickOne(whatsappBodies)} ${pickOne(whatsappClosings)}`;
}

export type CroKpi = {
  label: string;
  value: string;
  direction: 'positive' | 'negative' | 'neutral';
  description: string;
};

export function fakeCroKpis(): CroKpi[] {
  return croMetricDescriptors.map(([a, b], index) => {
    const deltaA = randomInt(25, 55);
    const deltaB = randomInt(12, 35);
    return {
      label: index === 0 ? a : b,
      value: index === 1 ? `- ${deltaB}%` : `+${deltaA}%`,
      direction: index === 1 ? 'negative' : 'positive',
      description:
        index === 0
          ? 'Após reduzir etapas e aplicar bundles dinâmicos'
          : index === 1
            ? 'Menos cliques e auto-fill em um passo'
            : 'Monitorado via Edge e budgets de Web Vitals',
    };
  });
}
