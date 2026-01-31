import z from "zod";

export const commentSchema = z.object({
  content: z.string().min(1).max(200),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
