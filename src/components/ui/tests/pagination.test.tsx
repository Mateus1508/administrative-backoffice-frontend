import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../pagination";

describe("Pagination", () => {
  it("exibe texto de exibição e página atual", () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        totalItems={25}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText(/Exibindo 1 a 10 de 25 registro\(s\)/)).toBeInTheDocument();
    expect(screen.getByText(/Página 1 de 3/)).toBeInTheDocument();
  });

  it("botão anterior desabilitado na primeira página", () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        totalItems={25}
        onPageChange={() => {}}
      />,
    );
    const prevBtn = screen.getByRole("button", { name: /Página anterior/ });
    expect(prevBtn).toBeDisabled();
  });

  it("botão próxima desabilitado na última página", () => {
    render(
      <Pagination
        page={3}
        pageSize={10}
        totalItems={25}
        onPageChange={() => {}}
      />,
    );
    const nextBtn = screen.getByRole("button", { name: /Próxima página/ });
    expect(nextBtn).toBeDisabled();
  });

  it("chama onPageChange ao clicar em próxima", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        page={1}
        pageSize={10}
        totalItems={25}
        onPageChange={onPageChange}
      />,
    );
    const nextBtn = screen.getByRole("button", { name: /Próxima página/ });
    await user.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("chama onPageChange ao clicar em anterior", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        page={2}
        pageSize={10}
        totalItems={25}
        onPageChange={onPageChange}
      />,
    );
    const prevBtn = screen.getByRole("button", { name: /Página anterior/ });
    await user.click(prevBtn);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("exibe select 'Por página' quando onPageSizeChange é passado", () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        totalItems={50}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByText("Por página:")).toBeInTheDocument();
  });

  it("totalPages é pelo menos 1 quando totalItems é 0", () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        totalItems={0}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByText(/Página 1 de 1/)).toBeInTheDocument();
    expect(screen.getByText(/Exibindo 1 a 0 de 0 registro\(s\)/)).toBeInTheDocument();
  });
});
