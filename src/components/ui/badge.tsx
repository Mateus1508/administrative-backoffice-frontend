import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-gray-100 text-gray-800",
  ativo: "bg-[#1cb454]/15 text-[#1cb454]",
  inativo: "bg-gray-200 text-gray-600",
  PARTNER: "bg-blue-100 text-blue-800",
  CUSTOMER: "bg-amber-100 text-amber-800",
  pendente: "bg-yellow-100 text-yellow-800",
  processando: "bg-blue-100 text-blue-800",
  entregue: "bg-[#1cb454]/15 text-[#1cb454]",
  cancelado: "bg-red-100 text-red-800",
  paga: "bg-[#1cb454]/15 text-[#1cb454]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
