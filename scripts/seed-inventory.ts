import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const ORG_IDS = Array.from({ length: 3 }).map(() => crypto.randomUUID());
const CATEGORIES = ["Periféricos", "Networking", "Componentes", "Automação", "Infraestrutura"];
const LOCATIONS = ["A-01", "B-12", "C-07", "D-03", "E-08", "F-15"];
const STATUS_OPTIONS: Array<"new" | "used" | "repair"> = ["new", "used", "repair"];
const MOVEMENT_NOTES = [
  "Reposição semanal",
  "Consumo em projeto piloto",
  "Reserva para manutenção",
  "Envio para cliente chave",
  "Retorno de empréstimo",
  "Descarte por avaria",
];

type InsertedUser = { id: string; org_id: string };
type InsertedItem = { id: string; org_id: string };

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFrom = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];

const chunk = <T>(input: T[], size: number): T[][] => {
  const output: T[][] = [];
  for (let i = 0; i < input.length; i += size) {
    output.push(input.slice(i, i + size));
  }
  return output;
};

async function seedUsers(): Promise<InsertedUser[]> {
  const payload = ORG_IDS.flatMap((orgId, idx) =>
    Array.from({ length: 5 }).map((_, inner) => ({
      org_id: orgId,
      email: `ops+${idx}-${inner}@example.com`,
    })),
  );

  const { data, error } = await supabase.from("users").insert(payload).select("id, org_id");
  if (error) {
    throw new Error(`Failed to insert users: ${error.message}`);
  }
  console.log(`Inserted ${data.length} users`);
  return data;
}

async function seedItems(): Promise<InsertedItem[]> {
  const items = Array.from({ length: 200 }).map((_, idx) => {
    const orgId = randomFrom(ORG_IDS);
    const minQty = randomInt(5, 40);
    const qty = minQty + randomInt(0, 80);
    return {
      org_id: orgId,
      sku: `SKU-${(idx + 1).toString().padStart(5, "0")}`,
      name: `Item ${idx + 1}`,
      category: randomFrom(CATEGORIES),
      location: randomFrom(LOCATIONS),
      status: randomFrom(STATUS_OPTIONS),
      min_qty: minQty,
      qty,
    };
  });

  const results: InsertedItem[] = [];
  for (const group of chunk(items, 50)) {
    const { data, error } = await supabase.from("items").insert(group).select("id, org_id");
    if (error) {
      throw new Error(`Failed to insert items: ${error.message}`);
    }
    results.push(...data);
  }
  console.log(`Inserted ${results.length} items`);
  return results;
}

async function seedMovements(items: InsertedItem[], users: InsertedUser[]): Promise<void> {
  const userByOrg = users.reduce<Record<string, InsertedUser[]>>((map, user) => {
    map[user.org_id] = map[user.org_id] ?? [];
    map[user.org_id].push(user);
    return map;
  }, {});

  const movementTypes: Array<"in" | "out" | "repair"> = ["in", "out", "repair"];
  const movements = Array.from({ length: 500 }).map(() => {
    const item = randomFrom(items);
    const user = randomFrom(userByOrg[item.org_id] ?? []);
    const type = randomFrom(movementTypes);
    return {
      org_id: item.org_id,
      item_id: item.id,
      user_id: user?.id ?? null,
      type,
      qty: randomInt(1, 20),
      note: randomFrom(MOVEMENT_NOTES),
    };
  });

  for (const group of chunk(movements, 100)) {
    const { error } = await supabase.from("movements").insert(group);
    if (error) {
      throw new Error(`Failed to insert movements: ${error.message}`);
    }
  }
  console.log("Inserted 500 movements");
}

async function main(): Promise<void> {
  try {
    console.time("seed-inventory");
    const users = await seedUsers();
    const items = await seedItems();
    await seedMovements(items, users);
    console.timeEnd("seed-inventory");
    console.log("Inventory seed completed successfully.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
