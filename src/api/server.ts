import {
  createServer,
  Model,
  Factory,
  RestSerializer,
  belongsTo,
  hasMany,
} from "miragejs";
import { registerUsersRoutes } from "./controllers/users.controller";
import { registerOrdersRoutes } from "./controllers/orders.controller";
import { registerCommissionsRoutes } from "./controllers/commissions.controller";
import { registerDashboardRoutes } from "./controllers/dashboard.controller";
import { usersSeed } from "./mocks/users";
import { ordersSeed } from "./mocks/orders";
import { commissionsSeed } from "./mocks/commissions";

type UserRole = "PARTNER" | "CUSTOMER";
type UserStatus = "ativo" | "inativo";
type CommissionStatus = "pendente" | "paga";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    serializers: {
      application: RestSerializer,
      order: RestSerializer.extend({
        include: ["user"],
        embed: true,
      }),
      commission: RestSerializer.extend({
        include: ["user", "order"],
        embed: true,
      }),
    },

    models: {
      user: Model.extend({
        orders: hasMany("order"),
        commissions: hasMany("commission"),
      }),

      order: Model.extend({
        user: belongsTo("user"),
        commissions: hasMany("commission"),
      }),

      commission: Model.extend({
        user: belongsTo("user"),
        order: belongsTo("order"),
      }),
    },

    factories: {
      user: Factory.extend({
        name(i) {
          return `Usuário ${i + 1}`;
        },
        email(i) {
          return `usuario${i + 1}@email.com`;
        },
        type: "CUSTOMER" as UserRole,
        country: "Brasil",
        status: "ativo" as UserStatus,
      }),

      order: Factory.extend({
        orderId(i) {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const n = i + 1;
          const letter = chars[(n - 1) % 26];
          const num = String(Math.floor((n - 1) / 26) + 1).padStart(3, "0");
          return `${letter}${letter}${letter}${num}`;
        },
        status: "entregue",
        amount(i) {
          return 100 + (i % 20) * 50;
        },
        date() {
          return new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10);
        },
        userId() {
          return "1";
        },
      }),

      commission: Factory.extend({
        amount(i) {
          return 10 + (i % 5) * 5;
        },
        status: "paga" as CommissionStatus,
        userId() {
          return "2";
        },
        orderId() {
          return "1";
        },
      }),
    },

    seeds(server) {
      for (const user of usersSeed) {
        server.create("user", user);
      }
      for (const order of ordersSeed) {
        server.create("order", order);
      }
      for (const commission of commissionsSeed) {
        server.create("commission", commission);
      }
    },

    routes() {
      this.namespace = "api";
      registerUsersRoutes(this);
      registerOrdersRoutes(this);
      registerCommissionsRoutes(this);
      registerDashboardRoutes(this);
    },
  });
}
