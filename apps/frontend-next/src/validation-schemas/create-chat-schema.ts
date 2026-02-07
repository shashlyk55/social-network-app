import { ChatType } from "@/types/chat";
import { z } from "zod";

export const createChatSchema = z
  .object({
    type: z.enum(ChatType),
    name: z.string().max(255, "Название слишком длинное").optional(),
    description: z.string().max(1000, "Описание слишком длинное").optional(),
    participantProfileIds: z
      .array(z.number())
      .min(1, "Необходимо выбрать хотя бы одного участника"),
  })
  .refine((data) => (data.type === ChatType.GROUP ? !!data.name : true), {
    message: "Групповой чат должен иметь название",
    path: ["name"],
  });

export type CreateChatInput = z.infer<typeof createChatSchema>;
