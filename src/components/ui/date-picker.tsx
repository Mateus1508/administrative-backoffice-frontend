"use client";

/**
 * DatePicker - Popover shadcn + Calendar (react-day-picker)
 * Header no formato: <- fevereiro 2026 -> (mês e ano clicáveis para seleção)
 */

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import type { DropdownProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Dropdown com Radix Select - mês/ano clicáveis, modal estilizado (padding, bordas arredondadas, hover verde) */
function DropdownRadix({
  options = [],
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const selectedOption = options.find((o) => o.value === value);
  const handleChange = (val: string) => {
    const syntheticEvent = {
      target: { value: Number(val) },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(syntheticEvent);
  };
  return (
    <SelectPrimitive.Root
      value={value != null ? String(value) : undefined}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex cursor-pointer select-none items-center justify-center rounded-md px-2 py-1 text-sm font-medium capitalize",
          "transition-colors hover:bg-muted/60",
          "border-0 bg-transparent focus:outline-none focus:ring-0",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <SelectPrimitive.Value>{selectedOption?.label}</SelectPrimitive.Value>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className={cn(
            "relative z-[100] max-h-80 min-w-[8rem] overflow-hidden",
            "rounded-lg border border-input bg-white shadow-lg",
            "p-1.5",
          )}
        >
          <SelectPrimitive.Viewport>
            {options.map(({ value: v, label, disabled: optDisabled }) => (
              <SelectPrimitive.Item
                key={v}
                value={String(v)}
                disabled={optDisabled}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-md py-2 px-3 text-sm outline-none",
                  "transition-colors hover:bg-primary/10 hover:text-primary",
                  "focus:bg-primary/10 focus:text-primary",
                  "data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary",
                  "data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary",
                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                )}
              >
                <SelectPrimitive.ItemText className="capitalize">
                  {label}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export interface DatePickerProps {
  /** ISO date string (yyyy-MM-dd) */
  value?: string;
  onChange?: (isoDate: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

function toDate(iso?: string): Date | undefined {
  if (!iso) return undefined;
  // força meio-dia pra evitar bug de timezone
  const d = new Date(iso + "T12:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toISODate(d?: Date): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione a data",
  id,
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = toDate(value);

  const handleSelect = React.useCallback(
    (d: Date | undefined) => {
      onChange?.(toISODate(d));
      setOpen(false);
    },
    [onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          data-empty={!date}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-primary" />
          {date ? (
            format(date, "dd/MM/yyyy", { locale: ptBR })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto overflow-hidden rounded-xl p-0 shadow-lg"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={ptBR}
          fromYear={2020}
          toYear={2035}
          captionLayout="dropdown"
          navLayout="around"
          className="p-4"
          classNames={{
            month:
              "grid grid-cols-[auto_1fr_auto] items-center justify-items-center gap-x-2 gap-y-2",
            month_caption: "col-start-2 justify-self-center",
            dropdowns: "flex items-center gap-2",
            button_previous:
              "col-start-1 justify-self-center h-8 w-8 shrink-0 rounded-md border border-input bg-transparent p-0 opacity-70 hover:opacity-100",
            button_next:
              "col-start-3 justify-self-center h-8 w-8 shrink-0 rounded-md border border-input bg-transparent p-0 opacity-70 hover:opacity-100",
            month_grid: "col-span-full w-full border-collapse space-y-1",
          }}
          components={{
            Dropdown: DropdownRadix,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
