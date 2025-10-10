"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Phone, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

const statsCards = [
  {
    number: "18",
    label: "Planned",
    sublabel: "Today",
    color: "bg-orange-100 text-orange-800",
    bgColor: "bg-orange-50",
  },
  {
    number: "12",
    label: "Finished",
    sublabel: "Yesterday",
    color: "bg-purple-100 text-purple-800",
    bgColor: "bg-purple-50",
  },
  { number: "24", label: "Due This", sublabel: "Week", color: "bg-green-100 text-green-800", bgColor: "bg-green-50" },
]

const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const calendarData = [
  [null, null, null, null, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
]

export function RightSidebar() {
  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="w-80 bg-gray-900/30 border-l border-gray-800 p-6 hidden xl:block overflow-y-auto"
    >
      {/* Project Discovery Call */}
      {/* <Card className="p-4 mb-6 bg-blue-600/10 border-blue-600/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-blue-400 mb-1">30 minutes call with Client</p>
            <h3 className="font-semibold">Project Discovery Call</h3>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" />
            Invite
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <Avatar key={i} className="w-8 h-8 border-2 border-gray-800">
                <AvatarImage src={`/call-participant-.jpg?height=32&width=32&query=call+participant+${i}`} />
                <AvatarFallback>P{i}</AvatarFallback>
              </Avatar>
            ))}
            <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs">
              +1
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-mono">28:35</span>
            <Button size="sm" variant="ghost">
              <Phone className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 ${stat.bgColor} border-0`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm font-medium text-gray-700">{stat.label}</div>
                <div className="text-xs text-gray-600">{stat.sublabel}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Calendar */}
      <Card className="p-4 bg-gray-800/30 border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">May, 2020</h3>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {calendarDays.map((day) => (
            <div key={day} className="text-center text-xs text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarData.flat().map((date, index) => (
            <div
              key={index}
              className={`
                text-center text-sm py-2 rounded cursor-pointer transition-colors
                ${date === null ? "" : "hover:bg-gray-700"}
                ${date === 16 ? "bg-blue-600 text-white" : ""}
                ${date && date < 16 ? "text-gray-400" : ""}
              `}
            >
              {date}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
