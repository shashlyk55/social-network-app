"use client";

import { useSignup } from "@/hooks/auth/use-signup";
import { SignupCredentials, AccountProviderType } from "@/types/auth";
import { signupSchema } from "@/validation-schemas/signup-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { mutate: register, isPending } = useSignup();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
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

  const onSubmit = (data: SignupFormValues) => {
    const requestData: SignupCredentials = {
      ...data,
      provider: AccountProviderType.LOCAL,
    };

    register(requestData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("Ошибки валидации:", errors)
      )}
    >
      <div>
        <label htmlFor="username">Username</label>
        <input {...registerField("username")} disabled={isPending} />
        {errors.username && (
          <p className="text-xs text-red-500">
            {String(errors.username.message)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="displayName">Display name</label>
        <input {...registerField("displayName")} disabled={isPending} />
        {errors.displayName && (
          <p className="text-xs text-red-500">
            {String(errors.displayName.message)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input {...registerField("email")} type="email" disabled={isPending} />
        {errors.email && (
          <p className="text-xs text-red-500">{String(errors.email.message)}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input {...registerField("password")} disabled={isPending} />
        {errors.password && (
          <p className="text-xs text-red-500">
            {String(errors.password.message)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="birthday">Birthday</label>
        <input
          {...registerField("birthday")}
          type="date"
          id="birthday"
          disabled={isPending}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {errors.birthday && (
          <p className="text-xs text-red-500">
            {String(errors.birthday.message)}
          </p>
        )}
      </div>

      <div>
        <input type="checkbox" {...registerField("isPublic")} id="isPublic" />
        <label htmlFor="isPublic">Is public profile?</label>
      </div>

      <button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Signup
      </button>
    </form>
  );
}
