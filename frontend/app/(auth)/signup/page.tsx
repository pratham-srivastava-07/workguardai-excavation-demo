"use client"

import { SignupForm } from "@/components/auth/Signup"
import { BackgroundPattern } from "@/components/sections/background-pattern"



export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundPattern />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold tracking-wide">
          <a href="/" className="hover:text-gray-300 transition-colors">
            RenoWise
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 transition-all duration-200 backdrop-blur-sm"
          >
            Login
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <SignupForm />
      </div>
    </div>
  )
}
