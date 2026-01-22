import { z } from "zod";

export const editProfileSchema = z.object({
  displayName: z.string().min(2, "Имя должно быть не менее 2 символов").max(50),
  username: z
    .string()
    .min(3, "Никнейм должен быть не менее 3 символов")
    .regex(/^[a-zA-Z0-9_]+$/, "Только латиница, цифры и подчеркивание"),
  bio: z.string().max(200, "Максимум 200 символов").nullable().optional(),
  avatarUrl: z
    .string()
    .url("Введите корректную ссылку")
    .or(z.literal(""))
    .nullable()
    .optional(),
  birthday: z.string().nullable().optional(),
  isPublic: z.boolean(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
