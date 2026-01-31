"use client";

import * as ContextMenu from "@radix-ui/react-context-menu";
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

interface CommentContextMenuProps {
  children: ReactNode; // В контекстном меню обычно называют children, а не trigger
  items: MenuItem[];
}

export function CommentContextMenu({
  children,
  items,
}: CommentContextMenuProps) {
  return (
    <ContextMenu.Root>
      {/* Теперь правый клик по любому элементу внутри триггера вызовет меню */}
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          // Стили можно оставить те же, что и в твоем ActionMenu
          className="z-[100] min-w-[180px] bg-[#1a1a1a] border border-[#333] rounded-2xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
        >
          {items.map((item, index) => (
            <ContextMenu.Item
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
                  : "text-slate-300"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
