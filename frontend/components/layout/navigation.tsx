"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { usePathname } from "next/navigation"

export const Navigation = () => {
  const pathName = usePathname();
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
      <div className="flex items-center space-x-8">
        <div
          className="text-2xl font-bold tracking-tight cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          reno<span className="text-blue-400">wise</span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
          <a href="#platform" className="hover:text-foreground transition-all duration-200 transform hover:scale-105 active:scale-95 px-2 py-1 rounded">
            platform
          </a>
          <a href="#network" className="hover:text-foreground transition-all duration-200 transform hover:scale-105 active:scale-95 px-2 py-1 rounded">
            network
          </a>
          <a href="#pricing" className="hover:text-foreground transition-all duration-200 transform hover:scale-105 active:scale-95 px-2 py-1 rounded">
            pricing
          </a>
        </div>
      </div>

      <div className="flex space-x-4">
         {pathName !== "/signup" && (
           <Button
          className="bg-transparent border border-blue-600 text-blue-600 px-5 py-2 rounded-full hover:bg-blue-50 transition transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => {
            // navigate to sign up
            window.location.href = "/signup"
          }}
        >
          Sign Up
        </Button>
         )}
        {pathName !== "/login" && (
           <Button
          className="bg-blue-600 text-white px-5 py-2 rounded-full transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl active:shadow-md"
          onClick={() => {
            // navigate to login
            window.location.href = "/login"
          }}
        >
          Login <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200" />
        </Button>
        )}
      </div>
    </nav>
  )
}
