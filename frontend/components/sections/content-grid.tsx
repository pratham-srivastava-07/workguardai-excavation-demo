"use client"

import { Card } from "@/components/ui/card"
import { Play, Star, Users, Wrench, TrendingUp } from "lucide-react"

export const ContentGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {/* Featured Project Card */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-card border-border overflow-hidden group hover:border-blue-400/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl">
        <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 group-active:scale-95 shadow-lg">
              <Play className="h-6 w-6 text-white ml-1" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-semibold mb-2">Kitchen Renovation</h3>
          <p className="text-sm text-muted-foreground mb-3">Complete kitchen makeover in 6 weeks</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Sarah M., Homeowner</span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.9</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Card */}
      <Card className="bg-gradient-to-br from-green-600/10 to-blue-600/10 border-green-400/20 p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:border-green-400/40">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Success Rate</h3>
            <p className="text-2xl font-bold text-green-400">98%</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Projects completed on time and within budget</p>
      </Card>

      {/* Network Card */}
      <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-400/20 p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:border-purple-400/40">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Contractors</h3>
            <p className="text-2xl font-bold text-purple-400">2,500+</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Verified professionals in your area</p>
      </Card>

      {/* Testimonial Card */}
      <Card className="col-span-1 md:col-span-2 bg-card border-border p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:border-border/60">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold transform transition-all duration-200 hover:scale-110 active:scale-95">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm mb-3 leading-relaxed">
              "RenoWise made our bathroom renovation seamless. Clear communication, transparent pricing, and quality
              work. Highly recommend!"
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">John Davis</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-yellow-400 text-yellow-400 transform transition-all duration-200 hover:scale-125"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* How It Works Card */}
      <Card className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border-orange-400/20 p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:border-orange-400/40">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Simple Process</h3>
            <p className="text-sm text-muted-foreground mt-1">Post → Quote → Build</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Three easy steps to your dream renovation</p>
      </Card>
    </div>
  )
}
