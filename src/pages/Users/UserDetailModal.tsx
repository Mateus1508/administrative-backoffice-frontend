import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

async function updateUser(
  id: string,
  data: Pick<User, "name" | "email" | "status">,
): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao atualizar usuário");
  const json = await res.json();
  return json.user ?? json;
}

interface UserDetailModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

function UserFormBody({ user, onClose }: { user: User; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    status: user.status,
  });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => updateUser(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário salvo com sucesso");
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning("O nome é obrigatório.");
      return;
    }
    if (!form.email.trim()) {
      toast.warning("O e-mail é obrigatório.");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-name">Nome</Label>
          <Input
            id="user-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-email">E-mail</Label>
          <Input
            id="user-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>País</Label>
          <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {user.country}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Tipo</Label>
          <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {user.type === "PARTNER" ? "Parceiro" : "Cliente"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.status === "ativo"}
            onClick={() =>
              setForm((f) => ({
                ...f,
                status: f.status === "ativo" ? "inativo" : "ativo",
              }))
            }
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#1cb454] focus:ring-offset-2",
              form.status === "ativo" ? "bg-[#1cb454]" : "bg-gray-200",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
                form.status === "ativo" ? "translate-x-5" : "translate-x-1",
              )}
            />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {form.status === "ativo" ? "Ativo" : "Inativo"}
        </p>

        {mutation.isError && (
          <p className="text-sm text-red-600">{mutation.error?.message}</p>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-[#1cb454] px-4 py-2 text-sm font-medium text-white hover:bg-[#169c44] disabled:opacity-50"
          >
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
  );
}

export function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  if (!user) return null;
  return (
    <Modal open={open} onClose={onClose} title="Detalhes do usuário">
      <UserFormBody key={user.id} user={user} onClose={onClose} />
    </Modal>
  );
}
