"use client";

import { UserPlus, LogOut, Loader2 } from "lucide-react";
import { ChatDetail } from "@/types/chat";
import { useRemoveParticipant } from "@/hooks/chat-participants/use-remove-participant";
import { useChatParticipants } from "@/hooks/chat-participants/use-chat-participants";
import { useMe } from "@/hooks/profile/use-me";
import { ChatMemberItem } from "./chat-member-item";
import { useModalStore } from "@/store/use-modal-store";

export const ChatMembers = ({ chat }: { chat: ChatDetail }) => {
  const { data: me } = useMe();
  const { data: participantsData, isLoading } = useChatParticipants(chat.id);
  const { mutate: RemoveParticipant, isPending: isPendingRemoveParticipant } =
    useRemoveParticipant(chat.id);
  const { onOpen } = useModalStore();

  const participants = participantsData?.data || [];

  const meParticipant = participants.find((p) => p.profile.id === me?.id);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-1">Members</h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-gray-500" />
          </div>
        ) : (
          participants.map((participant) => (
            <ChatMemberItem
              key={participant.id}
              participant={participant}
              chatId={chat.id}
              isMe={participant.profile.id === me?.id}
              myRole={meParticipant?.role}
            />
          ))
        )}
      </div>

      <div className="mt-auto pt-6 space-y-3">
        <button
          onClick={() => onOpen("addMembers", { chatId: chat.id })}
          className="w-full py-3 bg-[#00b4ff] text-black rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#0094d1] transition-colors"
        >
          <UserPlus size={16} /> Add Members
        </button>
        <button
          onClick={() => (me ? RemoveParticipant(me.id) : null)}
          disabled={isPendingRemoveParticipant}
          className="w-full py-3 bg-transparent border border-[#ff4b4b] text-[#ff4b4b] rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#ff4b4b]/10 transition-colors"
        >
          <LogOut size={16} />
          {isPendingRemoveParticipant ? "Leaving..." : "Leave Chat"}
        </button>
      </div>
    </div>
  );
};
