import type { User } from "@/types/user";

export type OrderStatus = "pendente" | "processando" | "entregue" | "cancelado";

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  status: OrderStatus;
  amount: number;
  date: string;
  productName?: string;
  user?: User;
}

export interface OrderFilters {
  status: OrderStatus | "";
  dateFrom: string;
  dateTo: string;
}
