interface MirageRecord {
  id?: string;
  attrs?: Record<string, unknown>;
  [key: string]: unknown;
}

interface MirageSchema {
  all: (model: string) => { models: MirageRecord[] };
  find: (model: string, id: string) => MirageRecord | undefined;
}

function getModels(schema: MirageSchema, model: string): MirageRecord[] {
  return schema.all(model).models;
}

export function getDashboard(schema: MirageSchema) {
  const users = getModels(schema, "user");
  const orders = getModels(schema, "order");
  const commissions = getModels(schema, "commission");

  const activeUsers = users.filter((u) => u.status === "ativo").length;
  const totalOrdersAmount = orders.reduce((sum, o) => sum + (o.amount ?? 0), 0);
  const totalCommissionsAmount = commissions.reduce(
    (sum, c) => sum + (c.amount ?? 0),
    0,
  );

  const ordersByStatus = ["pendente", "processando", "entregue", "cancelado"].map(
    (status) => ({
      status,
      count: orders.filter((o) => o.status === status).length,
      amount: orders
        .filter((o) => o.status === status)
        .reduce((sum, o) => sum + (o.amount ?? 0), 0),
    }),
  );

  const commissionsByStatus = ["pendente", "paga"].map((status) => ({
    status,
    count: commissions.filter((c) => c.status === status).length,
    amount: commissions
      .filter((c) => c.status === status)
      .reduce((sum, c) => sum + (c.amount ?? 0), 0),
  }));

  const productCounts = new Map<string, number>();
  for (const o of orders) {
    const name = o.productName ?? "Sem produto";
    productCounts.set(name, (productCounts.get(name) ?? 0) + 1);
  }
  const topProductsByOrders = Array.from(productCounts.entries())
    .map(([productName, count]) => ({ productName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  let latestYear = 0;
  let latestMonth = 0;
  for (const c of commissions) {
    const order = schema.find("order", c.orderId);
    const orderDate = order?.date ?? order?.attrs?.date;
    if (!orderDate) continue;
    const [y, m] = orderDate.split("-").map(Number);
    if (y > latestYear || (y === latestYear && m > latestMonth)) {
      latestYear = y;
      latestMonth = m;
    }
  }
  if (latestYear === 0) latestYear = new Date().getFullYear();
  if (latestMonth === 0) latestMonth = new Date().getMonth() + 1;

  const bySeller = new Map<string, { amount: number; count: number }>();
  for (const c of commissions) {
    const order = schema.find("order", c.orderId);
    const orderDate = order?.date ?? order?.attrs?.date;
    if (!orderDate) continue;
    const [y, m] = orderDate.split("-").map(Number);
    if (y !== latestYear || m !== latestMonth) continue;
    const uid = c.userId ?? c.attrs?.userId;
    if (!uid) continue;
    const cur = bySeller.get(uid) ?? { amount: 0, count: 0 };
    bySeller.set(uid, {
      amount: cur.amount + (c.amount ?? c.attrs?.amount ?? 0),
      count: cur.count + 1,
    });
  }
  const userById = new Map(users.map((u) => [u.id ?? u.attrs?.id, u]));
  const bestSellersCurrentMonth = Array.from(bySeller.entries())
    .map(([userId, { amount, count }]) => ({
      userId,
      userName: userById.get(userId)?.name ?? userById.get(userId)?.attrs?.name ?? `ID ${userId}`,
      amount,
      count,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  return {
    stats: {
      totalUsers: users.length,
      activeUsers,
      totalOrders: orders.length,
      totalOrdersAmount,
      totalCommissionsAmount,
    },
    ordersByStatus,
    commissionsByStatus,
    topProductsByOrders,
    bestSellersCurrentMonth,
  };
}
