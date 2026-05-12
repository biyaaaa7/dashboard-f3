import { LoginForm } from "@/features/auth/components/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
