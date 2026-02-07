import { ordersService } from "../services/orders.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerOrdersRoutes(server: any) {
  server.get("/orders", (schema: unknown, request: unknown) =>
    ordersService.list(
      schema as Parameters<typeof ordersService.list>[0],
      request as Parameters<typeof ordersService.list>[1],
    ),
  );
  server.get("/orders/:id", (schema: unknown, request: unknown) =>
    ordersService.getById(
      schema as Parameters<typeof ordersService.getById>[0],
      (request as { params: { id: string } }).params.id,
    ),
  );
  server.patch("/orders/:id", (schema: unknown, request: unknown) => {
    const req = request as { params: { id: string }; requestBody: string };
    return ordersService.update(
      schema as Parameters<typeof ordersService.update>[0],
      req.params.id,
      req.requestBody,
    );
  });
}
