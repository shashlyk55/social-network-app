"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMe } from "@/hooks/profile/use-me";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Home, LogOut, MessageSquare, Search, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLogout } from "@/hooks/auth/use-logout";

const NAV_ITEMS = [
  { label: "Home", href: "/feed", icon: Home },
  { label: "Chats", href: "/chats", icon: MessageSquare },
  { label: "Profile", href: "/profiles/me", icon: User },
  { label: "Search", href: "/profiles", icon: Search },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: me } = useMe();
  const { mutate: logout, isPending } = useLogout();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-slate-950 p-4 text-white">
      <div className="mb-8 flex items-center gap-3 px-2 text-2xl font-bold">
        <span>Innogram</span>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-slate-800",
                isActive ? "bg-slate-800 text-white" : "text-slate-400"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {me && (
        <div className="mt-auto border-t border-slate-800 pt-4">
          <Link
            href="/profiles/me"
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-800"
          >
            <UserAvatar
              src={me.avatarUrl}
              displayName={me.displayName}
              className="h-10 w-10 border-2 border-slate-700"
            />
            <div className="flex flex-col overflow-hidden text-sm">
              <span className="truncate font-medium">{me.displayName}</span>
              <span className="truncate text-xs text-slate-500">
                @{me.username}
              </span>
            </div>
          </Link>

          <button
            onClick={() => logout()}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>{isPending ? "Выход..." : "Выйти"}</span>
          </button>
        </div>
      )}
    </aside>
  );
};
