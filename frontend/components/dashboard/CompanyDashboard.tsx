"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Package, FileText, DollarSign, TrendingUp } from "lucide-react"
import { API_BASE_URL } from "@/constants/env";

export default function CompanyDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeOffers: 0,
    totalPosts: 0,
    pendingOffers: 0,
    ordersInProgress: 0,
  })
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [recentOffers, setRecentOffers] = useState<any[]>([])
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
        setCompanyInfo(data.companyInfo)
        setRecentOffers(data.recentOffers || [])
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
              <Building2 className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Company Dashboard</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400">{companyInfo?.companyName || 'Company'}</p>
                  {companyInfo?.verified && (
                    <Badge className="bg-green-900 text-green-200 border-green-700">Verified</Badge>
                  )}
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
        {/* Company Info Card */}
        {companyInfo && (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Company Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{companyInfo.description || 'No description available'}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="ml-2 font-semibold text-green-400">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Offers</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeOffers}</div>
              <p className="text-xs text-gray-400">Submitted to projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Service Posts</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
              <p className="text-xs text-gray-400">Active listings</p>
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
              <CardTitle className="text-sm font-medium text-white">Orders in Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.ordersInProgress}</div>
              <p className="text-xs text-gray-400">Active orders</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Offers */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Offers</CardTitle>
              <CardDescription className="text-gray-400">Your latest project bids</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOffers.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No offers yet</p>
              ) : (
                recentOffers.map((offer) => (
                  <div key={offer.id} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{offer.post?.title || 'Unknown Post'}</h3>
                      <Badge
                        variant={offer.status === "ACCEPTED" ? "default" : "secondary"}
                        className="bg-gray-700 text-white"
                      >
                        {offer.status}
                      </Badge>
                    </div>
                    {offer.amount && (
                      <div className="text-sm text-gray-400">
                        <span>Amount: €{(offer.amount / 100).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Service Listings</CardTitle>
              <CardDescription className="text-gray-400">Your active service posts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No posts yet</p>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex flex-col gap-2 p-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{post.title}</h3>
                      <Badge variant="default" className="bg-gray-700 text-white">
                        {post.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      {post.dailyRate && <span>Daily Rate: €{(post.dailyRate / 100).toFixed(2)}</span>}
                      {post.hourlyRate && <span>Hourly Rate: €{(post.hourlyRate / 100).toFixed(2)}</span>}
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
