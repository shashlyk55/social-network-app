"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostItem } from "./post-item";
import { Loader2 } from "lucide-react";
import { usePostsFeed } from "@/hooks/post/use-posts-feed";

const LIMIT = 10;

export function FeedList() {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = usePostsFeed(LIMIT);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-10 text-red-500">Error loading feed...</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      {data.pages.map((page) =>
        page.data.map((post) => <PostItem key={post.id} post={post} />)
      )}

      <div ref={ref} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && (
          <Loader2 className="animate-spin text-slate-500" />
        )}
        {!hasNextPage && data.pages[0].data.length > 0 && (
          <p className="text-slate-500 text-sm">
            You`ve reached the end of the feed
          </p>
        )}
      </div>
    </div>
  );
}
