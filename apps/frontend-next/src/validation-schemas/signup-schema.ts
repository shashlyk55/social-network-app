import * as z from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(20, "Максимум 20 символов")
    .regex(/^[a-zA-Z0-9_]+$/, "Только латиница, цифры и нижнее подчеркивание"),
  displayName: z.string().min(2, "Введите отображаемое имя"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Пароль должен быть не менее 8 символов"),
  isPublic: z.boolean().default(true),
  birthday: z
    .string()
    .nonempty("Поле не должно быть пустым")
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Укажите корректную дату",
      }
    ),
});
