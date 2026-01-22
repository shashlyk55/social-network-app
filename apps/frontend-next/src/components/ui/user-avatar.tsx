"use client";

import * as Avatar from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils/cn"; 

interface UserAvatarProps {
  src?: string | null;
  displayName: string;
  className?: string; // Для кастомизации размеров снаружи
}

export const UserAvatar = ({ src, displayName, className }: UserAvatarProps) => {
  const initial = displayName?.charAt(0).toUpperCase() || "?";

  return (
    <Avatar.Root 
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-slate-100", 
        className || "h-12 w-12" // Размер по умолчанию
      )}
    >
      {/* 1. Пытаемся загрузить реальное изображение */}
      <Avatar.Image
        src={src || undefined}
        alt={displayName}
        className="aspect-square h-full w-full object-cover"
      />

      {/* 2. Заглушка: показывается если src нет, или если картинка не грузится */}
      <Avatar.Fallback
        className="flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-white font-semibold"
        delayMs={600} // Короткая задержка, чтобы инициалы не "мигали" при быстрой загрузке фото
      >
        {initial}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};