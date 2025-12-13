"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Home, MapPin, Package, Briefcase, DollarSign, Calendar } from "lucide-react"

export default function HomeownerDashboard() {
  const router = useRouter()

  // Mock data - replace with actual API calls
  const [stats] = useState({
    activeProjects: 3,
    totalPosts: 12,
    pendingOffers: 5,
    completedProjects: 8,
  })

  const [recentProjects] = useState([
    {
      id: "1",
      title: "Kitchen Renovation",
      status: "IN_PROGRESS",
      budgetMin: 5000,
      budgetMax: 8000,
      size: 25,
    },
    {
      id: "2",
      title: "Bathroom Remodel",
      status: "OPEN",
      budgetMin: 3000,
      budgetMax: 5000,
      size: 15,
    },
  ])

  const [recentPosts] = useState([
    {
      id: "1",
      title: "Used Floor Tiles",
      type: "MATERIAL",
      status: "AVAILABLE",
      quantity: 50,
      unit: "pieces",
    },
    {
      id: "2",
      title: "Wooden Planks",
      type: "MATERIAL",
      status: "RESERVED",
      quantity: 20,
      unit: "m²",
    },
  ])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Homeowner Dashboard</h1>
                <p className="text-sm text-gray-400">Manage your projects and materials</p>
              </div>
            </div>
            <Button onClick={() => router.push("/map")} size="lg" className="bg-white text-black hover:bg-gray-200">
              <MapPin className="mr-2 h-4 w-4" />
              Explore Map
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
              <p className="text-xs text-gray-400">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Posts</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
              <p className="text-xs text-gray-400">Materials listed</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Pending Offers</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingOffers}</div>
              <p className="text-xs text-gray-400">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completedProjects}</div>
              <p className="text-xs text-gray-400">Finished projects</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Projects */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Projects</CardTitle>
              <CardDescription className="text-gray-400">Your latest renovation projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    <Badge
                      variant={project.status === "IN_PROGRESS" ? "default" : "secondary"}
                      className="bg-gray-700 text-white"
                    >
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>Size: {project.size}m²</span>
                    <Separator orientation="vertical" className="h-4 bg-gray-600" />
                    <span>
                      Budget: ${project.budgetMin.toLocaleString()} - ${project.budgetMax.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Posts</CardTitle>
              <CardDescription className="text-gray-400">Materials you've listed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{post.title}</h3>
                    <Badge
                      variant={post.status === "AVAILABLE" ? "default" : "secondary"}
                      className="bg-gray-700 text-white"
                    >
                      {post.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>Type: {post.type}</span>
                    <Separator orientation="vertical" className="h-4 bg-gray-600" />
                    <span>
                      Quantity: {post.quantity} {post.unit}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
