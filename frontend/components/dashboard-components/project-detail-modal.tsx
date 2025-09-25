"use client"

import { X, CheckCircle, Home, Euro, MapPin, Clock, Users, Calendar, FileText, Mail, Phone, Star } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  projectType: string
  size: number
  budgetMin: number
  budgetMax: number
  location: string
  timeline: string
  quoteCount: number
  createdAt: string
  materials: string
  requirements?: string[]
  homeowner: {
    name: string
    email: string
    phone: string
    rating: number
  }
}

interface ProjectDetailModalProps {
  isOpen: boolean
  project: Project | null
  projectTypeLabels: Record<string, string>
  onClose: () => void
  onSubmitQuote: () => void
  formatDate: (date: string) => string
  formatCurrency: (amount: number) => string
}

export function ProjectDetailModal({
  isOpen,
  project,
  projectTypeLabels,
  onClose,
  onSubmitQuote,
  formatDate,
  formatCurrency,
}: ProjectDetailModalProps) {
  if (!isOpen || !project) return null

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl bg-white rounded-md shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-gray-900">Project Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {projectTypeLabels[project.projectType]}
              </span>
            </div>

            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-2">Description</h5>
              <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
            </div>

            {project.requirements && (
              <div className="mb-6">
                <h5 className="font-medium text-gray-900 mb-3">Project Requirements</h5>
                <ul className="space-y-2">
                  {project.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h5 className="font-medium text-gray-900 mb-4">Project Information</h5>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Home className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Size: {project.size} m²</span>
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">
                    Budget: {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Location: {project.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Timeline: {project.timeline}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">
                    {project.quoteCount} quote{project.quoteCount !== 1 ? "s" : ""} submitted
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Posted: {formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Materials: {project.materials}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h5 className="font-medium text-gray-900 mb-4">Homeowner Information</h5>
              <div className="flex items-start mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{project.homeowner.name}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(project.homeowner.rating)}
                    <span className="text-xs text-gray-500 ml-1">({project.homeowner.rating})</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{project.homeowner.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{project.homeowner.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          <button
            onClick={onSubmitQuote}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Quote
          </button>
        </div>
      </div>
    </div>
  )
}
