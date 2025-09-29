"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Lightbulb, Search, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"

export function ProjectCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* R&D Banking App Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 border-0 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">R&D for New Banking</h3>
              <h3 className="text-lg font-semibold">Mobile App</h3>
            </div>
          </div>

          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="w-8 h-8 border-2 border-white">
                <AvatarImage src={`/team-member-.jpg?height=32&width=32&query=team+member+${i}`} />
                <AvatarFallback>T{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Create Signup Page Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 bg-gradient-to-br from-purple-600 to-pink-500 border-0 text-white relative overflow-hidden">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Create Signup</h3>
                <h3 className="text-lg font-semibold">Page</h3>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="47, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="30, 100"
                  strokeDashoffset="-47"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="23, 100"
                  strokeDashoffset="-77"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">47%</span>
              </div>
            </div>
          </div>

          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="w-8 h-8 border-2 border-white">
                <AvatarImage src={`/team-member-.jpg?height=32&width=32&query=team+member+${i + 3}`} />
                <AvatarFallback>T{i + 3}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
