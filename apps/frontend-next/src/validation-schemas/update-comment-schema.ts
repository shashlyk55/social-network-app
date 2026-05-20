import { z } from "zod";
import { createPostSchema } from "./create-post-schema";

export const updateCommentSchema = createPostSchema;

export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
