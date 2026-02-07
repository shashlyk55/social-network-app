"use client";

import { useActiveChatStore } from "@/store/use-active-chat-store";
import { useChat } from "@/hooks/chat/use-chat";
import { MessageSquare } from "lucide-react";
import { ChatHeader } from "./chat-header";
import { ChatSidebar } from "./chat-sidebar";
import { MessageList } from "../message/message-list";

export const ChatWindow = () => {
  const { activeChatId } = useActiveChatStore();
  const { data: chat, isLoading } = useChat(activeChatId ?? undefined);

  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#0f0f0f]">
        <MessageSquare size={48} className="mb-4 opacity-10" />
        <p className="text-sm font-medium">Выберите чат из списка слева</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#0f0f0f]">
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-800/50">
        <ChatHeader chat={chat} isLoading={isLoading} />
        <MessageList />
      </div>

      {chat && <ChatSidebar chat={chat} />}
    </div>
  );
};
