"use client"

import { Home, Euro, MapPin, Users, Calendar, Eye, Plus, Star } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  projectType: string
  size: number
  budgetMin: number
  budgetMax: number
  location: string
  quoteCount: number
  createdAt: string
  homeowner: {
    name: string
    rating: number
  }
}

interface ProjectCardProps {
  project: Project
  projectTypeLabels: Record<string, string>
  onViewProject: (project: Project) => void
  onQuoteProject: (project: Project) => void
  formatDate: (date: string) => string
  formatCurrency: (amount: number) => string
}

export function ProjectCard({
  project,
  projectTypeLabels,
  onViewProject,
  onQuoteProject,
  formatDate,
  formatCurrency,
}: ProjectCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {projectTypeLabels[project.projectType]}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Home className="h-4 w-4 mr-2" />
            <span>{project.size} m²</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Euro className="h-4 w-4 mr-2" />
            <span>
              {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {project.quoteCount} quote{project.quoteCount !== 1 ? "s" : ""} submitted
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Posted {formatDate(project.createdAt)}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{project.homeowner.name}</p>
              <div className="flex items-center space-x-1">
                {renderStars(project.homeowner.rating)}
                <span className="text-xs text-gray-500 ml-1">({project.homeowner.rating})</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewProject(project)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
              <button
                onClick={() => onQuoteProject(project)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
