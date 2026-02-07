import { Response } from "miragejs";

const ALLOWED_UPDATE_FIELDS = ["userId", "orderId", "amount", "status"];

function getQueryParam(
  queryParams: Record<string, string[] | string | null | undefined>,
  key: string
): string | null {
  const val = queryParams[key];
  if (val == null) return null;
  return Array.isArray(val) ? val[0] ?? null : val;
}

export const commissionsService = {
  list(schema: { all: (model: string) => { filter: (fn: (c: { status: string; userId: string; orderId: string }) => boolean) => unknown } }, request: { queryParams: Record<string, string[] | string | null | undefined> }) {
    const { queryParams } = request;
    const status = getQueryParam(queryParams, "status");
    const userId = getQueryParam(queryParams, "userId");
    const orderId = getQueryParam(queryParams, "orderId");

    let commissions = schema.all("commission");

    if (status) {
      commissions = commissions.filter((c) => c.status === status) as typeof commissions;
    }
    if (userId) {
      commissions = commissions.filter((c) => c.userId === userId) as typeof commissions;
    }
    if (orderId) {
      commissions = commissions.filter((c) => c.orderId === orderId) as typeof commissions;
    }

    return commissions;
  },

  getById(schema: { find: (model: string, id: string) => { update: (attrs: Record<string, unknown>) => void } | undefined }, id: string) {
    const commission = schema.find("commission", id);
    if (!commission) return new Response(404, {}, { errors: ["Not found"] });
    return commission;
  },

  update(
    schema: { find: (model: string, id: string) => { update: (attrs: Record<string, unknown>) => void } | undefined },
    id: string,
    requestBody: string
  ) {
    const commission = schema.find("commission", id);
    if (!commission) return new Response(404, {}, { errors: ["Not found"] });

    const body = JSON.parse(requestBody || "{}");
    const attrs: Record<string, unknown> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (body[key] !== undefined) attrs[key] = body[key];
    }
    commission.update(attrs);
    return commission;
  },
};
