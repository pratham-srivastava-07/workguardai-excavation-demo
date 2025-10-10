"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LayoutDashboard, CheckSquare, Compass, FolderOpen, BarChart3, CreditCard, User, Settings } from "lucide-react"

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: CheckSquare, label: "Tasks" },
  { icon: Compass, label: "Explore" },
  { icon: FolderOpen, label: "Projects" },
]

const profileItems = [
  { icon: BarChart3, label: "Charts" },
  { icon: CreditCard, label: "Billing" },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-gray-900/50 border-r border-gray-800 p-6 hidden lg:block"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <span className="font-bold text-lg">Renowise</span>
      </div>

      {/* User Profile */}
      <Card className="p-4 mb-8 bg-gray-800/50 border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/professional-avatar.png" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div>
            <p className="font-semibold text-sm">AR Shakir</p>
            <p className="text-xs text-gray-400">hi.arshakir.com</p>
            <span className="text-xs text-green-400">● Online</span>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">PROJECTS & TASKS</h3>
          <nav className="space-y-1">
            {navigationItems.map((item, index) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  item.active
                    ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">PROFILE & SETTINGS</h3>
          <nav className="space-y-1">
            {profileItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </motion.div>
  )
}
