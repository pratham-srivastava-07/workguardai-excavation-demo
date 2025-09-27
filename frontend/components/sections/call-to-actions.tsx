"use client"

import { Button } from "@/components/ui/button"

export const CallToAction = () => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between py-12 border-t border-border">
      <div className="mb-8 md:mb-0">
        <h2 className="text-2xl font-semibold mb-4">Ready to start your project?</h2>
        <p className="text-muted-foreground max-w-md">
          Join thousands of homeowners who've transformed their spaces with RenoWise.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          className="px-6 py-3 bg-transparent transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg active:shadow-sm border-2 hover:border-blue-400/50"
        >
          Browse Projects
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl active:shadow-md">
          Get Started
        </Button>
      </div>
    </div>
  )
}
