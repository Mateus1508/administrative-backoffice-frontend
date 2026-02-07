export type UserStatus = "ativo" | "inativo";
export type UserType = "PARTNER" | "CUSTOMER";

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  country: string;
  status: UserStatus;
}

export interface UserFilters {
  status: UserStatus | "";
  type: UserType | "";
  search: string;
}
