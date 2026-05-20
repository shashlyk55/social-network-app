"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface ActionMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  align?: "start" | "center" | "end";
}

export function ActionMenu({ trigger, items, align = "end" }: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          className="z-[100] min-w-[180px] bg-[#1a1a1a] border border-[#333] rounded-2xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, index) => (
            <DropdownMenu.Item
              key={index}
              disabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick?.();
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl cursor-pointer outline-none transition-colors",
                "hover:bg-[#252525] focus:bg-[#252525]",
                item.variant === "danger"
                  ? "text-red-500 hover:bg-red-500/10"
                  : "text-slate-300",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
