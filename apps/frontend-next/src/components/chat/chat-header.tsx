"use client";

import { Users, MoreVertical, Loader2 } from "lucide-react";
import { ChatDetail, ChatType } from "@/types/chat";
import { useChatSidebarStore } from "@/store/use-chat-sidebar-store";

interface ChatHeaderProps {
  chat?: ChatDetail;
  isLoading: boolean;
}

export const ChatHeader = ({ chat, isLoading }: ChatHeaderProps) => {
  const { toggle, isOpen } = useChatSidebarStore();

  if (isLoading)
    return (
      <div className="h-[68px] border-b border-gray-800 flex items-center px-4 bg-[#0f0f0f]">
        <Loader2 className="animate-spin text-gray-500" size={20} />
      </div>
    );

  if (!chat) return null;

  const displayName =
    chat.type === ChatType.PRIVATE
      ? chat.interlocutor?.profile.displayName
      : chat.name;

  return (
    <header className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0f0f0f] shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
            {displayName?.[0].toUpperCase()}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-sm text-white truncate max-w-[200px]">
            {displayName || "Приватный чат"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4 text-gray-400">
        <button
          onClick={toggle}
          className={`p-1 rounded-md transition ${
            isOpen ? "text-[#00b4ff] bg-[#00b4ff]/10" : "hover:text-white"
          }`}
        >
          <Users size={20} />
        </button>

        <button className="p-1 hover:bg-gray-800 rounded-md transition">
          <MoreVertical size={20} className="hover:text-white" />
        </button>
      </div>
    </header>
  );
};
