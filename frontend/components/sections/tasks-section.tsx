"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

const tasks = [
  {
    id: 1,
    company: "Uber",
    title: "App Design and Upgrades with new features",
    status: "In Progress",
    duration: "16 days",
    icon: "🚗",
    color: "bg-red-500",
    team: [1, 2, 3],
  },
  {
    id: 2,
    company: "Facebook Ads",
    title: "Facebook Ads Design for CreativeCloud",
    status: "Last worked 5 days ago",
    duration: "",
    icon: "f",
    color: "bg-blue-600",
    team: [1, 2, 3, 4],
  },
  {
    id: 3,
    company: "Payoneer",
    title: "Payoneer Dashboard Design",
    status: "Due in 3 days",
    duration: "",
    icon: "P",
    color: "bg-purple-600",
    team: [1, 2, 3],
  },
  {
    id: 4,
    company: "Upwork",
    title: "Designspring",
    status: "Viewed Just Now",
    duration: "Assigned 10 min ago",
    icon: "up",
    color: "bg-green-500",
    team: [1, 2, 3, 4],
  },
  {
    id: 5,
    company: "Upwork",
    title: "Designspring",
    status: "Viewed Just Now",
    duration: "Assigned 10 min ago",
    icon: "up",
    color: "bg-green-500",
    team: [1, 2, 3, 4],
  },
]

export function TasksSection() {
  return (
    <Card className="p-6 bg-gray-900/30 border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" className="text-blue-400 border-b-2 border-blue-400 rounded-none px-0">
            Active Tasks
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white px-0">
            Completed
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search" className="pl-10 w-48 bg-gray-800/50 border-gray-700" />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Today</h3>

        {tasks.slice(0, 3).map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/30 transition-colors"
          >
            <div
              className={`w-10 h-10 ${task.color} rounded-lg flex items-center justify-center text-white font-semibold`}
            >
              {task.icon}
            </div>

            <div className="flex-1">
              <h4 className="font-medium">{task.company}</h4>
              <p className="text-sm text-gray-400">
                {task.title} - {task.status} {task.duration}
              </p>
            </div>

            <div className="flex -space-x-2">
              {task.team.map((member, i) => (
                <Avatar key={i} className="w-6 h-6 border border-gray-700">
                  <AvatarImage src={`/team-member-.jpg?height=24&width=24&query=team+member+${member}`} />
                  <AvatarFallback className="text-xs">T{member}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </motion.div>
        ))}

        <h3 className="text-sm font-medium text-gray-400 mb-4 mt-8">Tomorrow</h3>

        {tasks.slice(3).map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 3) * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/30 transition-colors"
          >
            <div
              className={`w-10 h-10 ${task.color} rounded-lg flex items-center justify-center text-white font-semibold`}
            >
              {task.icon}
            </div>

            <div className="flex-1">
              <h4 className="font-medium">{task.company}</h4>
              <p className="text-sm text-gray-400">
                {task.title} - {task.status} - {task.duration}
              </p>
            </div>

            <div className="flex -space-x-2">
              {task.team.map((member, i) => (
                <Avatar key={i} className="w-6 h-6 border border-gray-700">
                  <AvatarImage src={`/team-member-.jpg?height=24&width=24&query=team+member+${member}`} />
                  <AvatarFallback className="text-xs">T{member}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
