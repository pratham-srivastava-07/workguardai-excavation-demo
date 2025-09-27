import { LoginForm } from "@/components/auth/Login";
import { Navigation } from "@/components/layout/navigation";
import { BackgroundPattern } from "@/components/sections/background-pattern";


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundPattern />

      <div className="relative z-10">
        <Navigation />

        <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
          <LoginForm />
        </main>
      </div>
    </div>
  )
}
