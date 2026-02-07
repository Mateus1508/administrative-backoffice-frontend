import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatBRL } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

async function updateOrder(
  id: string,
  data: Pick<Order, "status" | "amount">,
): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao atualizar pedido");
  const json = await res.json();
  return json.order ?? json;
}

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailModal({ order, open, onClose }: OrderDetailModalProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({
    status: "pendente" as OrderStatus,
    amount: 0,
  });

  useEffect(() => {
    if (order) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync form when selected order changes
      setForm({ status: order.status, amount: order.amount });
    }
  }, [order]);

  const mutation = useMutation({
    mutationFn: (data: typeof form) => {
      if (!order) return Promise.reject(new Error("Pedido não selecionado"));
      return updateOrder(order.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido salvo com sucesso");
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (!form.amount || form.amount <= 0) {
      toast.warning("O valor deve ser maior que zero.");
      return;
    }
    mutation.mutate(form);
  };

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose} title="Detalhes do pedido">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Código do pedido</Label>
          <p className="flex h-10 w-full items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {order.orderId}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Usuário</Label>
          <p className="flex h-10 w-full items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {order.user?.name ?? order.userId}
            {order.user?.email && (
              <span className="text-gray-500"> ({order.user.email})</span>
            )}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order-status">Status</Label>
          <Select
            value={form.status}
            onValueChange={(v: string) =>
              setForm((f) => ({ ...f, status: v as OrderStatus }))
            }
          >
            <SelectTrigger id="order-status">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="processando">Processando</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order-amount">Valor</Label>
          <Input
            id="order-amount"
            type="number"
            min={0}
            step={0.01}
            value={form.amount}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                amount: Number(e.target.value) || 0,
              }))
            }
            placeholder="0,00"
          />
          <p className="text-xs text-gray-500">{formatBRL(form.amount)}</p>
        </div>
        <div className="space-y-2">
          <Label>Data</Label>
          <p className="flex h-10 w-full items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {formatDate(order.date)}
          </p>
        </div>

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
    </Modal>
  );
}
