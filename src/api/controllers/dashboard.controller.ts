import type { Server } from "miragejs";
import { getDashboard } from "../services/dashboard.service";

export function registerDashboardRoutes(server: Server) {
  server.get("/dashboard", (schema: unknown) =>
    getDashboard(schema as Parameters<typeof getDashboard>[0]),
  );
}
