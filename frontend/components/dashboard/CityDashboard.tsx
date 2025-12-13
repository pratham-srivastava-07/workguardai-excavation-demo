"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Landmark, MapPin, Package, AlertTriangle, Recycle, BarChart3 } from "lucide-react"

export default function CityDashboard() {
  const router = useRouter()

  // Mock data - replace with actual API calls
  const [stats] = useState({
    totalPosts: 45,
    materialsRecycled: 1250,
    hazardousMaterials: 3,
    activeProjects: 18,
  })

  const [cityInfo] = useState({
    name: "Lisbon Municipal Services",
    verified: true,
    description: "Managing construction waste and promoting material reuse across the city",
    district: "Central Lisbon",
  })

  const [recentPosts] = useState([
    {
      id: "1",
      title: "Demolition Site Materials",
      type: "MATERIAL",
      subtype: "Mixed Construction",
      status: "AVAILABLE",
      quantity: 500,
      unit: "m³",
      hazardous: false,
    },
    {
      id: "2",
      title: "Reclaimed Bricks",
      type: "MATERIAL",
      subtype: "Bricks",
      status: "RESERVED",
      quantity: 2000,
      unit: "pieces",
      hazardous: false,
    },
    {
      id: "3",
      title: "Asbestos Removal Site",
      type: "MATERIAL",
      subtype: "Hazardous",
      status: "AVAILABLE",
      quantity: 50,
      unit: "m²",
      hazardous: true,
    },
  ])

  const [recyclingStats] = useState([
    { material: "Wood", percentage: 85 },
    { material: "Concrete", percentage: 72 },
    { material: "Metal", percentage: 93 },
    { material: "Glass", percentage: 68 },
  ])

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
                  <p className="text-sm text-gray-400">{cityInfo.name}</p>
                  {cityInfo.verified && <Badge className="bg-blue-900 text-blue-200 border-blue-700">Official</Badge>}
                </div>
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
        {/* City Info Card */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Municipal Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">{cityInfo.description}</p>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-400">District:</span>
                <span className="ml-2 font-semibold text-white">{cityInfo.district}</span>
              </div>
              <Separator orientation="vertical" className="h-4 bg-gray-600" />
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2 font-semibold text-green-400">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <div className="text-2xl font-bold text-white">{stats.materialsRecycled}t</div>
              <p className="text-xs text-gray-400">This quarter</p>
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
              <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
              <p className="text-xs text-gray-400">In the district</p>
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
              {recentPosts.map((post) => (
                <div key={post.id} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{post.title}</h3>
                    <div className="flex gap-2">
                      {post.hazardous && (
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
                    <Separator orientation="vertical" className="h-4 bg-gray-600" />
                    <span>
                      Quantity: {post.quantity} {post.unit}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recycling Stats */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recycling Performance</CardTitle>
              <CardDescription className="text-gray-400">Material recovery rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recyclingStats.map((stat) => (
                <div key={stat.material} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{stat.material}</span>
                    <span className="font-semibold text-white">{stat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${stat.percentage}%` }}
                    />
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
