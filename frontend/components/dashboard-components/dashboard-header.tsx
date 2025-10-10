"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Bell, Settings } from "lucide-react"
import { motion } from "framer-motion"

export function DashboardHeader() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-gray-800 bg-gray-900/30 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between p-6">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-2xl font-bold mb-1">Renowise.</h1>
          <p className="text-gray-400">Hello Shakir, welcome back!</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search Dashboard"
              className="pl-10 w-64 bg-gray-800/50 border-gray-700 focus:border-blue-500"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="relative">
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/professional-avatar.png" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
