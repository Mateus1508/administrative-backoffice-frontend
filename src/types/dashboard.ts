export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalOrdersAmount: number;
  totalCommissionsAmount: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
  amount: number;
}

export interface CommissionStatusCount {
  status: string;
  count: number;
  amount: number;
}

export interface ProductOrderCount {
  productName: string;
  count: number;
}

export interface BestSellerMonth {
  userId: string;
  userName: string;
  amount: number;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  ordersByStatus: OrderStatusCount[];
  commissionsByStatus: CommissionStatusCount[];
  topProductsByOrders: ProductOrderCount[];
  bestSellersCurrentMonth: BestSellerMonth[];
}
