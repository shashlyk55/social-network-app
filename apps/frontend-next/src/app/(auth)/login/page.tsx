import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-[350px] space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">С возвращением</h1>
          <p className="text-sm text-gray-500">Введите данные для входа</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500">
          Нет аккаунта? <Link href="/signup">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
