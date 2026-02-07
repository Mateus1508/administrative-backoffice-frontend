import { Response } from "miragejs";

const ALLOWED_UPDATE_FIELDS = ["name", "email", "status"];

function getQueryParam(
  queryParams: Record<string, string[] | string | null | undefined>,
  key: string,
): string | null {
  const val = queryParams[key];
  if (val == null) return null;
  return Array.isArray(val) ? (val[0] ?? null) : val;
}

export const usersService = {
  list(
    schema: {
      all: (model: string) => {
        filter: (
          fn: (u: {
            status: string;
            type: string;
            name: string;
            email: string;
          }) => boolean,
        ) => unknown;
      };
    },
    request: {
      queryParams: Record<string, string[] | string | null | undefined>;
    },
  ) {
    const { queryParams } = request;
    const status = getQueryParam(queryParams, "status");
    const type = getQueryParam(queryParams, "type");
    const search = getQueryParam(queryParams, "search");

    let users = schema.all("user");

    if (status) {
      users = users.filter(
        (u: { status: string }) => u.status === status,
      ) as typeof users;
    }
    if (type) {
      users = users.filter(
        (u: { type: string }) => u.type === type,
      ) as typeof users;
    }
    if (search) {
      const term = search.toLowerCase();
      users = users.filter(
        (u: { name: string; email: string }) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term),
      ) as typeof users;
    }

    return users;
  },

  getById(
    schema: {
      find: (
        model: string,
        id: string,
      ) => { update: (attrs: Record<string, unknown>) => void } | undefined;
    },
    id: string,
  ) {
    const user = schema.find("user", id);
    if (!user) return new Response(404, {}, { errors: ["Not found"] });
    return user;
  },

  update(
    schema: {
      find: (
        model: string,
        id: string,
      ) => { update: (attrs: Record<string, unknown>) => void } | undefined;
    },
    id: string,
    requestBody: string,
  ) {
    const user = schema.find("user", id);
    if (!user) return new Response(404, {}, { errors: ["Not found"] });

    const body = JSON.parse(requestBody || "{}");
    const attrs: Record<string, unknown> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (body[key] !== undefined) attrs[key] = body[key];
    }
    user.update(attrs);
    return user;
  },
};
