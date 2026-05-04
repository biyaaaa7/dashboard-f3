import { LoginForm } from "@/features/auth/components/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/logo_depan.png"
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        {/* Overlay to ensure readability */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
      </div>

      {/* Login Content */}
      <div className="z-10 w-full flex justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
