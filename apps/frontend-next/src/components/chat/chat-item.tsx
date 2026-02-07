"use client";

import { ChatPreview, ChatType } from "@/types/chat";
import { useActiveChatStore } from "@/store/use-active-chat-store";
import { formatDistanceToNow } from "date-fns";
import { UserAvatar } from "../ui/user-avatar";

interface ChatItemProps {
  chat: ChatPreview;
}

export const ChatItem = ({ chat }: ChatItemProps) => {
  const { activeChatId, setActiveChatId } = useActiveChatStore();

  const isActive = activeChatId === chat.id;

  const isPrivate = chat.type === ChatType.PRIVATE;

  const displayName = isPrivate
    ? chat.interlocutor?.profile.displayName || "Пользователь"
    : chat.name || "Групповой чат";

  const avatarSrc = isPrivate ? chat.interlocutor?.profile.avatarUrl : null;

  return (
    <div
      onClick={() => setActiveChatId(chat.id)}
      className={`px-4 py-3 flex gap-3 cursor-pointer transition-all border-l-2 ${
        isActive
          ? "bg-[#151515] border-[#00b4ff]"
          : "border-transparent hover:bg-[#111111]"
      }`}
    >
      <UserAvatar
        src={avatarSrc}
        displayName={displayName}
        className="h-12 w-12 shadow-lg"
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-1">
          <h3
            className={`font-semibold truncate text-sm ${isActive ? "text-[#00b4ff]" : "text-white"}`}
          >
            {displayName}
          </h3>
          <span className="text-[10px] text-gray-500 whitespace-nowrap">
            {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {chat.type === ChatType.GROUP
            ? "Групповой чат"
            : "Чат с пользователем"}
        </p>
      </div>
    </div>
  );
};
