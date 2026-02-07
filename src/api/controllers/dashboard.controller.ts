import { getDashboard } from "../services/dashboard.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerDashboardRoutes(server: any) {
  server.get("/dashboard", (schema: unknown) =>
    getDashboard(schema as Parameters<typeof getDashboard>[0]),
  );
}
