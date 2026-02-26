"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { PostItem } from "@/components/post/post-item";
import { useProfilePosts } from "@/hooks/post/use-profile-posts";

const LIMIT = 10;

interface ProfilePostListProps {
  profileId: number;
  activeTab: "posts" | "archive";
}

export function ProfilePostList({
  profileId,
  activeTab,
}: ProfilePostListProps) {
  const { ref, inView } = useInView();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProfilePosts({
      authorProfileId: profileId,
      isArchived: activeTab === "archive",
      limit: LIMIT,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const isEmpty = !data?.pages[0]?.data.length;

  return (
    <div className="space-y-6 mb-10">
      <AnimatePresence mode="popLayout">
        {data?.pages.map((page) =>
          page.data.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <PostItem post={post} isArchivePage={activeTab === "archive"} />
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* Сенсор скролла */}
      {hasNextPage && (
        <div ref={ref} className="h-20 flex justify-center items-center">
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          )}
        </div>
      )}

      {isEmpty && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border border-dashed border-[#222] rounded-3xl"
        >
          <p className="text-slate-500">
            {activeTab === "posts"
              ? "You haven't posted anything yet"
              : "Your archive is empty"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
