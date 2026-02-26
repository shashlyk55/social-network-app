import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090909] p-4 py-12">
      <div className="w-full max-w-[450px]">
        <SignupForm
          title="Create account"
          subtitle="Join our creative community today"
        />

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
