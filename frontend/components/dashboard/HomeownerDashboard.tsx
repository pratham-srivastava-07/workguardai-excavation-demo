"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Home, MapPin, Package, Briefcase, DollarSign, Calendar } from "lucide-react"
import { API_BASE_URL } from "@/constants/env";

export default function HomeownerDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalPosts: 0,
    pendingOffers: 0,
    completedProjects: 0,
  })
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const data = await response.json()
        setStats(data.stats)
        setRecentProjects(data.recentProjects || [])
        setRecentPosts(data.recentPosts || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

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
            <Button onClick={() => router.push("/map")} size="lg" className="bg-white text-black hover:bg-gray-200 cursor-pointer">
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
              {recentProjects.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No projects yet</p>
              ) : (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:bg-gray-750">
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
                      {project.size && <span>Size: {project.size}m²</span>}
                      {project.size && project.budgetMin && <Separator orientation="vertical" className="h-4 bg-gray-600" />}
                      {project.budgetMin && project.budgetMax && (
                        <span>
                          Budget: ${project.budgetMin.toLocaleString()} - ${project.budgetMax.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Posts</CardTitle>
              <CardDescription className="text-gray-400">Materials you've listed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No posts yet</p>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:bg-gray-750">
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
                      {post.quantity && (
                        <>
                          <Separator orientation="vertical" className="h-4 bg-gray-600" />
                          <span>
                            Quantity: {post.quantity} {post.unit || 'units'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
