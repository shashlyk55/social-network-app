"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/validation-schemas/login-schema";
import { useLogin } from "@/hooks/auth/use-login";
import { Loader2 } from "lucide-react";
import { AccountProviderType } from "@/types/auth";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const handleOAuth = (provider: AccountProviderType) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login/${provider}`;
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email text-sm">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="name@example.com"
            className="flex h-10 rounded-md border px-3 py-2 text-sm"
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="password text-sm">Пароль</label>
          <input
            {...register("password")}
            type="password"
            className="flex h-10 rounded-md border px-3 py-2 text-sm"
            disabled={isPending}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 items-center justify-center rounded-md bg-black text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Войти
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Или войти через
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleOAuth(AccountProviderType.GOOGLE)}
          className="border rounded-md py-2 hover:bg-zinc-50"
        >
          Google
        </button>
      </div>
    </div>
  );
}
