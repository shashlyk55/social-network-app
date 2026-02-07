import { ChatType } from "@/types/chat";
import z from "zod";

export const updateChatSchema = z
  .object({
    type: z.enum(ChatType),
    name: z
      .string()
      .min(1, "Название не может быть пустым")
      .max(255)
      .optional(),
    description: z.string().max(1000).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.type === ChatType.PRIVATE) {
        return !data.name && !data.description;
      }
      return true;
    },
    {
      message: "Для приватных чатов нельзя менять название или описание",
      path: ["name"],
    }
  );

export type UpdateChatInput = z.infer<typeof updateChatSchema>;
