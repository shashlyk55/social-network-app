"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check } from "lucide-react";

import { ChatType } from "@/types/chat";
import { FollowDirection } from "@/types/profile";
import { useModalStore } from "@/store/use-modal-store";
import { useChatCreationStore } from "@/store/use-chat-creation-store";
import { useCreateChat } from "@/hooks/chat/use-create-chat";
import { useFollows } from "@/hooks/follow/use-follows";
import {
  CreateChatInput,
  createChatSchema,
} from "@/validation-schemas/create-chat-schema";
import { useMe } from "@/hooks/profile/use-me";
import { useEffect } from "react";

export const CreateChatModal = () => {
  const { data: me } = useMe();
  const { isOpen, type, onClose } = useModalStore();
  const { selectedProfileIds, setSelectedProfileIds, toggleProfile, reset } =
    useChatCreationStore();
  const { mutate: createChat, isPending } = useCreateChat();
  const isModalOpen = isOpen && type === "createChat";
  const { data: follows } = useFollows(FollowDirection.FOLLOWING, me?.id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset: resetForm,
  } = useForm<CreateChatInput>({
    resolver: zodResolver(createChatSchema),
    defaultValues: {
      type: ChatType.GROUP,
      participantProfileIds: me ? [me.id] : [],
    },
  });

  useEffect(() => {
    if (isModalOpen && me) {
      setSelectedProfileIds([me.id]);
      setValue("participantProfileIds", [me.id]);
    }
  }, [isModalOpen, me, setSelectedProfileIds, setValue]);

  const onSubmit = (values: CreateChatInput) => {
    createChat(
      { ...values, participantProfileIds: selectedProfileIds },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    resetForm();
    reset();
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] w-full max-w-md rounded-xl border border-gray-800 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create Group Chat</h2>
          <X
            className="cursor-pointer text-gray-400 hover:text-white"
            onClick={handleClose}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 space-y-4 overflow-y-auto"
        >
          {/* Название группы */}
          <div>
            <label className="text-[10px] font-bold text-[#00b4ff] uppercase">
              Group Name
            </label>
            <input
              {...register("name")}
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md p-3 mt-1 outline-none focus:border-[#00b4ff] text-white"
              placeholder="Enter group name..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="text-[10px] font-bold text-[#00b4ff] uppercase">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md p-3 mt-1 h-20 resize-none outline-none focus:border-[#00b4ff] text-white"
              placeholder="What's this group about?"
            />
          </div>

          {/* Список участников */}
          <div>
            <label className="text-[10px] font-bold text-[#00b4ff] uppercase">
              Select Participants
            </label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {follows?.data.map((follow) => (
                <div
                  key={follow.id}
                  onClick={() => toggleProfile(follow.id)}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                      {follow.displayName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {follow.displayName}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        @{follow.username}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                      selectedProfileIds.includes(follow.id)
                        ? "bg-[#00b4ff] border-[#00b4ff]"
                        : "border-gray-600"
                    }`}
                  >
                    {selectedProfileIds.includes(follow.id) && (
                      <Check size={12} className="text-black" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedProfileIds.length === 0 && (
              <p className="text-yellow-500/80 text-[10px] mt-2 italic">
                Select at least one member
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-md font-bold bg-gray-800 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || selectedProfileIds.length === 0}
              className="flex-1 py-3 rounded-md font-bold bg-[#00b4ff] text-black hover:bg-[#0094d1] disabled:opacity-50 transition"
            >
              {isPending ? "Creating..." : "Create Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
