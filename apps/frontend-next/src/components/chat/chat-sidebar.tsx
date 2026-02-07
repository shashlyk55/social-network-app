"use client";

import { useState } from "react";
import { ChatDetail, ChatType } from "@/types/chat";
import { useChatSidebarStore } from "@/store/use-chat-sidebar-store";
import { ChatMembers } from "./chat-members";
import { ChatSettings } from "./chat-settings";

interface ChatSidebarProps {
  chat: ChatDetail;
}

export const ChatSidebar = ({ chat }: ChatSidebarProps) => {
  const { isOpen } = useChatSidebarStore();
  const [activeTab, setActiveTab] = useState<"members" | "settings">("members");

  if (!isOpen) return null;

  return (
    <div className="w-[350px] border-l border-gray-800 bg-[#0a0a0a] flex flex-col h-full shrink-0">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("members")}
          className={`flex-1 py-4 text-xs font-bold transition relative ${
            activeTab === "members" ? "text-white" : "text-gray-500"
          }`}
        >
          Members
          {activeTab === "members" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00b4ff]" />
          )}
        </button>
        {chat.type === ChatType.GROUP && (
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-4 text-xs font-bold transition relative ${
              activeTab === "settings" ? "text-white" : "text-gray-500"
            }`}
          >
            Settings
            {activeTab === "settings" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00b4ff]" />
            )}
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === "members" ? (
          <ChatMembers chat={chat} />
        ) : (
          <ChatSettings chat={chat} />
        )}
      </div>
    </div>
  );
};
