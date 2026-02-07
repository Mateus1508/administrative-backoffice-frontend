import { Response } from "miragejs";

const ALLOWED_UPDATE_FIELDS = ["status", "amount"];

function getQueryParam(
  queryParams: Record<string, string[] | string | null | undefined>,
  key: string
): string | null {
  const val = queryParams[key];
  if (val == null) return null;
  return Array.isArray(val) ? val[0] ?? null : val;
}

export const ordersService = {
  list(schema: { all: (model: string) => { filter: (fn: (o: { status: string; date: string }) => boolean) => unknown } }, request: { queryParams: Record<string, string[] | string | null | undefined> }) {
    const { queryParams } = request;
    const status = getQueryParam(queryParams, "status");
    const dateFrom = getQueryParam(queryParams, "dateFrom");
    const dateTo = getQueryParam(queryParams, "dateTo");

    let orders = schema.all("order");

    if (status) {
      orders = orders.filter((o) => o.status === status) as typeof orders;
    }
    if (dateFrom) {
      orders = orders.filter((o) => o.date >= dateFrom) as typeof orders;
    }
    if (dateTo) {
      orders = orders.filter((o) => o.date <= dateTo) as typeof orders;
    }

    return orders;
  },

  getById(schema: { find: (model: string, id: string) => { update: (attrs: Record<string, unknown>) => void } | undefined }, id: string) {
    const order = schema.find("order", id);
    if (!order) return new Response(404, {}, { errors: ["Not found"] });
    return order;
  },

  update(
    schema: { find: (model: string, id: string) => { update: (attrs: Record<string, unknown>) => void } | undefined },
    id: string,
    requestBody: string
  ) {
    const order = schema.find("order", id);
    if (!order) return new Response(404, {}, { errors: ["Not found"] });

    const body = JSON.parse(requestBody || "{}");
    const attrs: Record<string, unknown> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (body[key] !== undefined) attrs[key] = body[key];
    }
    order.update(attrs);
    return order;
  },
};
