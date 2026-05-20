import { z } from "zod";

export const MAX_POST_CONTENT_LENGTH = 1000;

export const createPostSchema = z.object({
  content: z
    .string()
    .max(MAX_POST_CONTENT_LENGTH, "Post is too long (max 1000 characters)"),
  assetIds: z.array(z.number()).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
