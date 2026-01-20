import * as z from "zod";

export const loginSchema = z.object({
  password: z.string().min(1, "Введите пароль"),
  email: z.string().email("Некорректный email"),
});
