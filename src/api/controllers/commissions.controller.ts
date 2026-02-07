import { commissionsService } from "../services/commissions.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerCommissionsRoutes(server: any) {
  server.get("/commissions", (schema: unknown, request: unknown) =>
    commissionsService.list(
      schema as Parameters<typeof commissionsService.list>[0],
      request as Parameters<typeof commissionsService.list>[1],
    ),
  );
  server.get("/commissions/:id", (schema: unknown, request: unknown) =>
    commissionsService.getById(
      schema as Parameters<typeof commissionsService.getById>[0],
      (request as { params: { id: string } }).params.id,
    ),
  );
  server.patch("/commissions/:id", (schema: unknown, request: unknown) => {
    const req = request as { params: { id: string }; requestBody: string };
    return commissionsService.update(
      schema as Parameters<typeof commissionsService.update>[0],
      req.params.id,
      req.requestBody,
    );
  });
}
