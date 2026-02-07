import { usersService } from "../services/users.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerUsersRoutes(server: any) {
  server.get("/users", (schema: unknown, request: unknown) =>
    usersService.list(
      schema as Parameters<typeof usersService.list>[0],
      request as Parameters<typeof usersService.list>[1],
    ),
  );
  server.get("/users/:id", (schema: unknown, request: unknown) =>
    usersService.getById(
      schema as Parameters<typeof usersService.getById>[0],
      (request as { params: { id: string } }).params.id,
    ),
  );
  server.patch("/users/:id", (schema: unknown, request: unknown) => {
    const req = request as { params: { id: string }; requestBody: string };
    return usersService.update(
      schema as Parameters<typeof usersService.update>[0],
      req.params.id,
      req.requestBody,
    );
  });
}
