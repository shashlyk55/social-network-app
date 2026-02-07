"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Paperclip, Send, Loader2 } from "lucide-react";
import { useCreateChat } from "@/hooks/chat/use-create-chat";
import { useActiveChatStore } from "@/store/use-active-chat-store";
import { ChatType } from "@/types/chat";

export const MessageInput = () => {
  const [text, setText] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const { activeChatId, setActiveChatId } = useActiveChatStore();
  const { mutateAsync: createChat, isPending: isCreating } = useCreateChat();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageTrimmed = text.trim();

    if (!messageTrimmed || isCreating) return;

    /* 
    Create virtual private chat(chat not created on server 
    but on frontned we can send first message to this chat, 
    which initiate creating chat on server) 
    
    Like in Telegram App
    */
    if (activeChatId === -1) {
      const pendingProfileId = searchParams.get("pendingProfileId");

      if (!pendingProfileId) return;

      try {
        const newChat = await createChat({
          type: ChatType.PRIVATE,
          participantProfileIds: [Number(pendingProfileId)],
          firstMessage: { content: messageTrimmed },
        });

        // Clear URL (Delete ?pendingProfileId=...)
        router.replace("/chats");

        setActiveChatId(newChat.id);

        setText("");
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    } else {
      // Send message logic
      // sendMessage(activeChatId, messageTrimmed);
      setText("");
    }
  };

  return (
    <div className="p-4 border-t border-gray-800/50 bg-[#0a0a0a]">
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl px-4 py-2 focus-within:ring-1 focus-within:ring-[#00b4ff] transition-all"
      >
        <button
          type="button"
          className="text-gray-500 hover:text-[#00b4ff] transition p-1"
        >
          <Paperclip size={20} />
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCreating}
          placeholder={
            activeChatId === -1
              ? "Write your first message..."
              : "Write a message..."
          }
          className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-white placeholder:text-gray-600"
        />

        <button
          type="submit"
          disabled={!text.trim() || isCreating}
          className="text-[#00b4ff] hover:text-[#33c3ff] disabled:opacity-30 disabled:hover:text-[#00b4ff] transition p-1"
        >
          {isCreating ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
};
