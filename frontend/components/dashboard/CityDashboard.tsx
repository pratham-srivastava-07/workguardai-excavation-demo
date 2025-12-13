"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Landmark, MapPin, Package, AlertTriangle, Recycle, BarChart3 } from "lucide-react"
import { API_BASE_URL } from "@/constants/env";

export default function CityDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    materialsRecycled: 0,
    hazardousMaterials: 0,
    activePickups: 0,
  })
  const [cityInfo, setCityInfo] = useState<any>(null)
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const data = await response.json()
        setStats(data.stats)
        setCityInfo(data.cityInfo)
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
              <Landmark className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">City Dashboard</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400">{cityInfo?.cityName || 'City'}</p>
                  {cityInfo?.verified && <Badge className="bg-blue-900 text-blue-200 border-blue-700">Official</Badge>}
                </div>
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
        {/* City Info Card */}
        {cityInfo && (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Municipal Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{cityInfo.description || 'No description available'}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="ml-2 font-semibold text-green-400">Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Material Posts</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
              <p className="text-xs text-gray-400">Available for reuse</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Recycled</CardTitle>
              <Recycle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.materialsRecycled}</div>
              <p className="text-xs text-gray-400">Materials recycled</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Hazardous</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.hazardousMaterials}</div>
              <p className="text-xs text-gray-400">Requiring attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Pickups</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activePickups}</div>
              <p className="text-xs text-gray-400">In progress</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Posts */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Material Posts</CardTitle>
              <CardDescription className="text-gray-400">Latest materials from demolition sites</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No posts yet</p>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{post.title}</h3>
                      <div className="flex gap-2">
                        {post.hazardousMaterials && (
                          <Badge variant="destructive" className="bg-orange-900 text-orange-200">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Hazardous
                          </Badge>
                        )}
                        <Badge variant="default" className="bg-gray-700 text-white">
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Type: {post.subtype}</span>
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

          {/* Engagement Overview */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Engagement Overview</CardTitle>
              <CardDescription className="text-gray-400">Platform activity metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Total Posts</span>
                  <span className="font-semibold text-white">{stats.totalPosts}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((stats.totalPosts / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Materials Recycled</span>
                  <span className="font-semibold text-white">{stats.materialsRecycled}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((stats.materialsRecycled / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
