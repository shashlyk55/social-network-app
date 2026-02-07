"use client";

import { useActiveChatStore } from "@/store/use-active-chat-store";
import { MessageInput } from "./message-input";
import { Send } from "lucide-react";
import { useChat } from "@/hooks/chat/use-chat";

export const MessageList = () => {
  const { activeChatId } = useActiveChatStore();
  const { data: chat } = useChat(
    activeChatId && activeChatId !== -1 ? activeChatId : undefined
  );

  if (!activeChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f0f0f] text-gray-500">
        Выберите чат, чтобы начать общение
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0f0f0f]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {activeChatId === -1 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-50">
            <Send size={24} className="text-[#00b4ff]" />
            <p className="text-white font-medium">Новый диалог</p>
          </div>
        ) : (
          <div className="text-white">
            {/* Здесь будет рендер сообщений, можно использовать chat.description */}
            {chat?.description && (
              <p className="text-xs text-gray-500 mb-4">{chat.description}</p>
            )}
            Messages for chat {activeChatId}
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
