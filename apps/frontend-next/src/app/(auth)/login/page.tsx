import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090909] p-4">
      <div className="w-full max-w-[400px]">
        <LoginForm
          title="Welcome back"
          subtitle="Sign in to continue to your creative space"
        />

        <p className="mt-8 text-center text-sm text-zinc-500">
          Dont have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:underline transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
