import { ChatList } from "@/components/chat/chat-list";
import { ChatWindow } from "@/components/chat/chat-window";

export default function ChatsPage() {
  return (
    <main className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden">
      {/* Левая панель: Список чатов */}
      <section className="w-[350px] border-r border-gray-800 flex flex-col">
        <ChatList />
      </section>

      {/* Центральная часть: Сообщения */}
      <section className="flex-1 flex flex-col bg-[#0f0f0f]">
        <ChatWindow />
      </section>
    </main>
  );
}
