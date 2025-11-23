import { getServiceClient } from "@/lib/supabase/server";

export type InventoryStatus = "new" | "used" | "repair";

export interface InventoryFilters {
  search?: string;
  status?: InventoryStatus;
  category?: string;
  location?: string;
  orgId?: string;
}

export interface InventoryItem {
  id: string;
  org_id: string;
  sku: string;
  name: string;
  category: string;
  location: string | null;
  status: InventoryStatus;
  min_qty: number;
  qty: number;
  created_at: string;
}

export interface InventoryMovement {
  id: string;
  type: "in" | "out" | "repair";
  qty: number;
  note: string | null;
  created_at: string;
  user_email: string | null;
}

export interface InventoryListResponse {
  items: InventoryItem[];
  stats: {
    total: number;
    lowStock: number;
    categories: Record<string, number>;
    status: Record<string, number>;
  };
  facets: {
    categories: string[];
    locations: Array<string | null>;
  };
  orgId: string | null;
}

export async function getInventoryList(filters: InventoryFilters = {}): Promise<InventoryListResponse> {
  const client = getServiceClient();

  const orgId = await resolveOrgId(client, filters.orgId);
  if (!orgId) {
    return { items: [], stats: { total: 0, lowStock: 0, categories: {}, status: {} }, facets: { categories: [], locations: [] }, orgId: null };
  }

  let query = client.from("items").select("*").eq("org_id", orgId).order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.location) query = query.eq("location", filters.location);
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  const categories = Array.from(new Set(data.map((item) => item.category)));
  const locations = Array.from(new Set(data.map((item) => item.location)));

  const stats = data.reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.qty <= item.min_qty) acc.lowStock += 1;
      acc.categories[item.category] = (acc.categories[item.category] ?? 0) + 1;
      acc.status[item.status] = (acc.status[item.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, lowStock: 0, categories: {} as Record<string, number>, status: {} as Record<string, number> },
  );

  return {
    items: data,
    stats,
    facets: { categories, locations },
    orgId,
  };
}

export async function getInventoryDetail(id: string): Promise<{ item: InventoryItem; movements: InventoryMovement[] }> {
  const client = getServiceClient();

  const { data: item, error } = await client.from("items").select("*").eq("id", id).single();
  if (error || !item) throw error ?? new Error("Item not found");

  const { data: movements, error: movementError } = await client
    .from("movements")
    .select("id,type,qty,note,created_at,user_id")
    .eq("item_id", id)
    .order("created_at", { ascending: false });

  if (movementError) throw movementError;

  const userIds = Array.from(
    new Set(
      (movements ?? [])
        .map((movement) => movement.user_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  let userMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: usersData } = await client.from("users").select("id,email").in("id", userIds);
    userMap = Object.fromEntries((usersData ?? []).map((user) => [user.id, user.email]));
  }

  const formatted: InventoryMovement[] =
    movements?.map((movement) => ({
      id: movement.id,
      type: movement.type,
      qty: movement.qty,
      note: movement.note,
      created_at: movement.created_at,
      user_email: movement.user_id ? userMap[movement.user_id] ?? null : null,
    })) ?? [];

  return { item, movements: formatted };
}

export async function getLowStockReport(orgId?: string) {
  const client = getServiceClient();
  const tenant = await resolveOrgId(client, orgId);
  if (!tenant) return [];

  const { data, error } = await client.from("items").select("*").eq("org_id", tenant);
  if (error) throw error;

  return (data ?? []).filter((item) => item.qty <= item.min_qty);
}

async function resolveOrgId(client: ReturnType<typeof getServiceClient>, explicit?: string): Promise<string | null> {
  if (explicit) return explicit;
  const { data, error } = await client.from("items").select("org_id").limit(1);
  if (error) return null;
  return data?.[0]?.org_id ?? null;
}
