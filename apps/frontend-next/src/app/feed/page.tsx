// src/app/feed/page.tsx
import { FeedList } from "@/components/post/feed-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed | Social Network",
  description: "Explore posts from people you follow",
};

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Feed</h1>
          <p className="text-slate-500 mt-2">
            Posts from users you are following
          </p>
        </header>

        <FeedList />
      </div>
    </main>
  );
}
