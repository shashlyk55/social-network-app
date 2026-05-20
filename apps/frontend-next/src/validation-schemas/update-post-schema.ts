import z from "zod";
import { createPostSchema } from "./create-post-schema";

export const updatePostSchema = createPostSchema;

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
