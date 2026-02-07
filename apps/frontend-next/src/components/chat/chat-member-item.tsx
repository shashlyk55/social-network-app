"use client";

import {
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  UserMinus,
} from "lucide-react";
import { ChatParticipant, ChatParticipantRole } from "@/types/chat-participant";
import { useUpdateRole } from "@/hooks/chat-participants/use-update-role";
import { useRemoveParticipant } from "@/hooks/chat-participants/use-remove-participant";
import { ActionMenu } from "../ui/action-menu";

interface ChatMemberItemProps {
  participant: ChatParticipant;
  chatId: number;
  isMe: boolean;
  myRole?: ChatParticipantRole;
}

export const ChatMemberItem = ({
  participant,
  chatId,
  isMe,
  myRole,
}: ChatMemberItemProps) => {
  const { mutate: UpdateRole, isPending: isPendingUpdateRole } =
    useUpdateRole(chatId);
  const removeMutation = useRemoveParticipant(chatId);

  const canManage =
    !isMe &&
    (myRole === ChatParticipantRole.CREATOR ||
      (myRole === ChatParticipantRole.ADMIN &&
        participant.role === ChatParticipantRole.MEMBER));

  const menuItems = [
    {
      label:
        participant.role === ChatParticipantRole.ADMIN
          ? "Demote to Member"
          : "Make Admin",
      icon:
        participant.role === ChatParticipantRole.ADMIN
          ? ShieldAlert
          : ShieldCheck,
      onClick: () =>
        UpdateRole({
          profileId: participant.profile.id,
          role:
            participant.role === ChatParticipantRole.ADMIN
              ? ChatParticipantRole.MEMBER
              : ChatParticipantRole.ADMIN,
        }),
      disabled: isPendingUpdateRole || myRole !== ChatParticipantRole.CREATOR,
    },
    {
      label: "Remove from chat",
      icon: UserMinus,
      variant: "danger" as const,
      onClick: () => {
        if (confirm(`Remove ${participant.profile.displayName}?`)) {
          removeMutation.mutate(participant.profile.id);
        }
      },
      disabled: removeMutation.isPending,
    },
  ];

  const roleStyles = {
    [ChatParticipantRole.CREATOR]: "border-amber-500 text-amber-500",
    [ChatParticipantRole.ADMIN]: "border-purple-500 text-purple-500",
    [ChatParticipantRole.MEMBER]: "border-[#00b4ff] text-[#00b4ff]",
  };

  return (
    <div className="flex items-center justify-between group py-2">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
            participant.role === ChatParticipantRole.CREATOR
              ? "bg-amber-600"
              : "bg-pink-600"
          }`}
        >
          {participant.profile.displayName[0]}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">
            {participant.profile.displayName}{" "}
            {isMe && (
              <span className="text-gray-500 font-normal ml-1">(You)</span>
            )}
          </p>
          <p className="text-[10px] text-gray-500 truncate">
            @{participant.profile.username}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${roleStyles[participant.role]}`}
        >
          {participant.role}
        </span>

        {canManage && (
          <ActionMenu
            trigger={
              <button className="p-1 hover:bg-[#252525] rounded-md transition-colors text-gray-400">
                <MoreHorizontal size={16} />
              </button>
            }
            items={menuItems}
          />
        )}
      </div>
    </div>
  );
};
