"use client";

import { useState } from "react";
import { ChatDetail } from "@/types/chat";
import { useUpdateChat } from "@/hooks/chat/use-update-chat";
import { useDeleteChat } from "@/hooks/chat/use-delete-chat";

export const ChatSettings = ({ chat }: { chat: ChatDetail }) => {
  const [name, setName] = useState(chat.name || "");
  const [description, setDescription] = useState(chat.description || "");

  const { mutate: updateChat, isPending } = useUpdateChat(chat.id);
  const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat();

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this chat? This action cannot be undone."
      )
    ) {
      deleteChat(chat.id);
    }
  };

  const handleSave = () => {
    updateChat({
      type: chat.type, // Сохраняем текущий тип чата
      name: name,
      description: description,
    });
  };

  return (
    <div className="space-y-6">
      {/* Group Avatar Section */}
      <div>
        <label className="text-[10px] font-bold text-[#00b4ff] uppercase block mb-3">
          Group Avatar
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#00b4ff] flex items-center justify-center text-2xl font-bold text-black">
            {name[0]?.toUpperCase() || "G"}
          </div>
          <button className="px-4 py-2 bg-[#1a1a1a] rounded-md text-[11px] font-bold text-white hover:bg-[#252525] transition border border-gray-800">
            Change Avatar
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-[#00b4ff] uppercase block mb-1.5">
            Group Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md p-3 text-xs text-white outline-none focus:border-[#00b4ff]"
            placeholder="Enter group name..."
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#00b4ff] uppercase block mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md p-3 h-24 text-xs text-white outline-none focus:border-[#00b4ff] resize-none"
            placeholder="Group description..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending || !name.trim()}
          className="py-3 bg-[#00b4ff] text-black rounded-lg font-bold text-xs hover:bg-[#0094d1] transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="py-3 bg-transparent border border-[#ff4b4b] text-[#ff4b4b] rounded-lg font-bold text-xs hover:bg-[#ff4b4b]/10 transition disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};
