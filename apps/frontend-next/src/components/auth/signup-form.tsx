"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, Pencil } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

import { useSignup } from "@/hooks/auth/use-signup";
import {
  SignupFormValues,
  signupSchema,
} from "@/validation-schemas/signup-schema";
import { AccountProviderType } from "@/types/auth";

interface SignupFormProps {
  title: string;
  subtitle: string;
}

export function SignupForm({ title, subtitle }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = useSignup();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      isPublic: true,
      username: "",
      email: "",
      password: "",
      displayName: "",
      birthday: "",
    },
  });

  const isPublic = watch("isPublic");

  const onSubmit = (data: SignupFormValues) => {
    register({ ...data, provider: AccountProviderType.LOCAL });
  };

  return (
    <div className="rounded-3xl bg-[#121212] p-8 text-white shadow-2xl border border-white/5">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">
              Username
            </label>
            <input
              {...registerField("username")}
              placeholder="johndoe"
              className="w-full rounded-xl border border-zinc-800 bg-[#1A1A1A] px-4 py-2.5 text-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.username && (
              <p className="text-[10px] text-red-400 ml-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">
              Display Name
            </label>
            <input
              {...registerField("displayName")}
              placeholder="John Doe"
              className="w-full rounded-xl border border-zinc-800 bg-[#1A1A1A] px-4 py-2.5 text-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 ml-1">
            Email address
          </label>
          <input
            {...registerField("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-zinc-800 bg-[#1A1A1A] px-4 py-2.5 text-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.email && (
            <p className="text-[10px] text-red-400 ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 ml-1">
            Password
          </label>
          <div className="relative">
            <input
              {...registerField("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-800 bg-[#1A1A1A] px-4 py-2.5 text-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] text-red-400 ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 ml-1">
            Birthday
          </label>
          <input
            {...registerField("birthday")}
            type="date"
            className="w-full rounded-xl border border-zinc-800 bg-[#1A1A1A] px-4 py-2.5 text-sm [color-scheme:dark] transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center justify-between py-3 px-1 bg-zinc-900/30 rounded-2xl border border-white/5 mt-2">
          <div className="flex flex-col pl-2">
            <span className="text-sm font-medium">Public Profile</span>
            <span className="text-[11px] text-zinc-500">
              Others can see your space
            </span>
          </div>
          <Switch.Root
            checked={isPublic}
            onCheckedChange={(checked) => setValue("isPublic", checked)}
            className="w-11 h-6 bg-zinc-800 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer transition-colors mr-2"
          >
            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-1 will-change-transform data-[state=checked]:translate-x-6" />
          </Switch.Root>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl font-bold transition-all mt-4 shadow-lg shadow-indigo-500/10"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Create account"
          )}
        </motion.button>
      </form>
    </div>
  );
}
