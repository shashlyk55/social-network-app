"use client";

import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChatType, ChatPreview } from "@/types/chat";
import { useActiveChatStore } from "@/store/use-active-chat-store";
import { ChatItem } from "./chat-item";
import { useChats } from "@/hooks/chat/use-chats";
import { ChatParticipantRole } from "@/types/chat-participant";
import { useEffect } from "react";
import { ProfilePreview } from "@/types/profile";

export const ChatList = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const pendingProfileId = searchParams.get("pendingProfileId");
  const { activeChatId, setActiveChatId } = useActiveChatStore();

  const { data, isLoading } = useChats({});

  const pendingProfile = pendingProfileId
    ? queryClient.getQueryData<ProfilePreview>([
        "profile",
        Number(pendingProfileId),
      ])
    : null;

  useEffect(() => {
    if (pendingProfileId) {
      setActiveChatId(-1);
    }
  }, [pendingProfileId, setActiveChatId]);

  const virtualChat: ChatPreview | null = pendingProfile
    ? {
        id: -1,
        type: ChatType.PRIVATE,
        name: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        interlocutor: {
          id: 0,
          role: ChatParticipantRole.CREATOR,
          joinedAt: new Date(),
          profile: {
            id: pendingProfile.id,
            username: pendingProfile.username,
            displayName: pendingProfile.displayName,
            avatarUrl: pendingProfile.avatarUrl,
          },
        },
      }
    : null;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {virtualChat && <ChatItem chat={virtualChat} />}
      {data?.data.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};
