import { PostDetailView } from "@/components/post/post-detail-view";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const resolvedParams = await params;
  const postId = Number(resolvedParams.postId);

  console.log("Resolved Post ID:", postId);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <PostDetailView postId={Number(postId)} />
    </div>
  );
}
