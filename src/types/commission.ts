import type { User } from "@/types/user";
import type { Order } from "@/types/order";

export type CommissionStatus = "pendente" | "paga";

export interface Commission {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: CommissionStatus;
  user?: User;
  order?: Order;
}

export interface CommissionFilters {
  status: CommissionStatus | "";
}
