"use client"
import type React from "react"
import { useState } from "react"
import { Briefcase } from "lucide-react"

import { ContractorHeader } from "@/components/dashboard-components/contractor-header"
import { TabNavigation } from "@/components/dashboard-components/tab-navigation"
import { ProjectCard } from "@/components/dashboard-components/project-card"
import { QuotesTable } from "@/components/dashboard-components/quotes-table"
import { ProjectDetailModal } from "@/components/dashboard-components/project-detail-modal"
import { QuoteDetailModal } from "@/components/dashboard-components/quote-detail-modal"
import { SubmitQuoteModal } from "@/components/dashboard-components/submit-quote-modal"
import { StatsCards } from "../dashboard-components/stats-card"
import { ProjectFilters } from "../dashboard-components/project-filter"

// Mock data - replace with your API calls
const mockProjects = [
  {
    id: "1",
    title: "Modern Kitchen Renovation",
    description:
      "Complete kitchen makeover with new cabinets, countertops, and appliances. Looking for high-quality materials and experienced contractors.",
    projectType: "kitchen_renovation",
    size: 25,
    budgetMin: 15000,
    budgetMax: 22000,
    predictedCost: 18500,
    status: "OPEN",
    createdAt: "2024-01-15T10:30:00Z",
    homeowner: {
      name: "Maria Virtanen",
      email: "maria.v@email.com",
      phone: "+358 40 123 4567",
      rating: 4.8,
    },
    quoteCount: 3,
    materials: "Premium materials preferred",
    location: "Helsinki, Finland",
    timeline: "6-8 weeks",
    requirements: [
      "Licensed electrician for appliance installation",
      "Plumbing modifications required",
      "Custom cabinet installation",
      "Granite countertop installation",
    ],
  },
  {
    id: "2",
    title: "Bathroom Modernization",
    description: "Full bathroom renovation including plumbing, tiling, and fixtures. Need waterproofing expertise.",
    projectType: "bathroom_renovation",
    size: 8,
    budgetMin: 8000,
    budgetMax: 12000,
    predictedCost: 10000,
    status: "OPEN",
    createdAt: "2024-01-14T14:20:00Z",
    homeowner: {
      name: "Jukka Nieminen",
      email: "jukka.n@email.com",
      phone: "+358 50 987 6543",
      rating: 4.6,
    },
    quoteCount: 1,
    materials: "Modern, water-resistant materials",
    location: "Espoo, Finland",
    timeline: "4-5 weeks",
    requirements: [
      "Waterproofing certification required",
      "Tile installation expertise",
      "Modern fixture installation",
      "Ventilation system upgrade",
    ],
  },
  {
    id: "3",
    title: "Living Room & Dining Area Update",
    description: "Open concept renovation, flooring, painting, and built-in storage solutions.",
    projectType: "living_room_renovation",
    size: 45,
    budgetMin: 12000,
    budgetMax: 18000,
    predictedCost: 15000,
    status: "OPEN",
    createdAt: "2024-01-13T09:15:00Z",
    homeowner: {
      name: "Anna Korhonen",
      email: "anna.k@email.com",
      phone: "+358 44 555 1234",
      rating: 4.9,
    },
    quoteCount: 2,
    materials: "Scandinavian style preferred",
    location: "Tampere, Finland",
    timeline: "3-4 weeks",
    requirements: [
      "Hardwood flooring installation",
      "Custom built-in storage",
      "Professional painting",
      "Electrical work for lighting",
    ],
  },
]

const mockMyQuotes = [
  {
    id: "q1",
    projectId: "1",
    projectTitle: "Modern Kitchen Renovation",
    totalAmount: 19500,
    laborCost: 8500,
    materialsCost: 9000,
    extrasCost: 2000,
    laborHours: 120,
    notes: "Premium materials and experienced team. Timeline flexible.",
    status: "PENDING",
    submittedAt: "2024-01-16T08:00:00Z",
    homeowner: { name: "Maria Virtanen" },
  },
  {
    id: "q2",
    projectId: "4",
    projectTitle: "Outdoor Deck Construction",
    totalAmount: 8500,
    laborCost: 5000,
    materialsCost: 3000,
    extrasCost: 500,
    laborHours: 80,
    notes: "Weather-resistant materials included.",
    status: "ACCEPTED",
    submittedAt: "2024-01-12T16:30:00Z",
    homeowner: { name: "Pekka Laaksonen" },
  },
]

const projectTypeLabels: any = {
  kitchen_renovation: "Kitchen",
  bathroom_renovation: "Bathroom",
  living_room_renovation: "Living Room",
  bedroom_renovation: "Bedroom",
  full_house_renovation: "Full House",
  outdoor_renovation: "Outdoor",
}

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState("available")
  const [projects, setProjects] = useState(mockProjects)
  const [myQuotes, setMyQuotes] = useState(mockMyQuotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [budgetRange, setBudgetRange] = useState("all")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false)
  const [isQuoteDetailOpen, setIsQuoteDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    totalAmount: "",
    laborHours: "",
    laborCost: "",
    materialsCost: "",
    extrasCost: "",
    notes: "",
  })

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || project.projectType === selectedType
    const matchesBudget =
      budgetRange === "all" ||
      (budgetRange === "low" && project.budgetMax <= 10000) ||
      (budgetRange === "medium" && project.budgetMax > 10000 && project.budgetMax <= 20000) ||
      (budgetRange === "high" && project.budgetMax > 20000)

    return matchesSearch && matchesType && matchesBudget
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedType("all")
    setBudgetRange("all")
  }

  const handleSubmitQuote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!quoteForm.totalAmount) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Add to my quotes
    const newQuote = {
      id: `q${Date.now()}`,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      totalAmount: Number.parseInt(quoteForm.totalAmount),
      laborCost: Number.parseInt(quoteForm.laborCost) || 0,
      materialsCost: Number.parseInt(quoteForm.materialsCost) || 0,
      extrasCost: Number.parseInt(quoteForm.extrasCost) || 0,
      laborHours: Number.parseInt(quoteForm.laborHours) || 0,
      notes: quoteForm.notes,
      status: "PENDING",
      submittedAt: new Date().toISOString(),
      homeowner: selectedProject.homeowner,
    }

    setMyQuotes([newQuote, ...myQuotes])

    // Update project quote count
    setProjects(projects.map((p) => (p.id === selectedProject.id ? { ...p, quoteCount: p.quoteCount + 1 } : p)))

    setIsQuoteModalOpen(false)
    setQuoteForm({ totalAmount: "", laborHours: "", laborCost: "", materialsCost: "", extrasCost: "", notes: "" })
    setSelectedProject(null)
    setIsLoading(false)

    // Show success message
    alert("Quote submitted successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "ACCEPTED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewProject = (project: any) => {
    setSelectedProject(project)
    setIsProjectDetailOpen(true)
  }

  const handleQuoteProject = (project: any) => {
    setSelectedProject(project)
    setIsQuoteModalOpen(true)
  }

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote)
    setIsQuoteDetailOpen(true)
  }

  const handleQuoteFormChange = (field: keyof typeof quoteForm, value: string) => {
    setQuoteForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false)
    setQuoteForm({ totalAmount: "", laborHours: "", laborCost: "", materialsCost: "", extrasCost: "", notes: "" })
    setSelectedProject(null)
  }

  const handleSubmitQuoteFromDetail = () => {
    setIsProjectDetailOpen(false)
    setIsQuoteModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      <ContractorHeader companyName="Rakennusyritys Oy" userEmail="contractor@email.com" userInitials="RY" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatsCards
          availableProjects={projects.length}
          myQuotes={myQuotes.length}
          acceptedQuotes={myQuotes.filter((q) => q.status === "ACCEPTED").length}
          totalValue={formatCurrency(myQuotes.reduce((sum, q) => sum + q.totalAmount, 0))}
        />

        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          availableCount={filteredProjects.length}
          quotesCount={myQuotes.length}
        />

        {activeTab === "available" && (
          <>
            <ProjectFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              budgetRange={budgetRange}
              onSearchChange={setSearchTerm}
              onTypeChange={setSelectedType}
              onBudgetChange={setBudgetRange}
              onClearFilters={clearFilters}
              projectTypeLabels={projectTypeLabels}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  projectTypeLabels={projectTypeLabels}
                  onViewProject={handleViewProject}
                  onQuoteProject={handleQuoteProject}
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more projects.</p>
              </div>
            )}
          </>
        )}

        {activeTab === "quotes" && (
          <QuotesTable
            quotes={myQuotes}
            onViewQuote={handleViewQuote}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusColor={getStatusColor}
          />
        )}
      </div>

      <ProjectDetailModal
        isOpen={isProjectDetailOpen}
        project={selectedProject}
        projectTypeLabels={projectTypeLabels}
        onClose={() => setIsProjectDetailOpen(false)}
        onSubmitQuote={handleSubmitQuoteFromDetail}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <QuoteDetailModal
        isOpen={isQuoteDetailOpen}
        quote={selectedQuote}
        onClose={() => setIsQuoteDetailOpen(false)}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        getStatusColor={getStatusColor}
      />

      <SubmitQuoteModal
        isOpen={isQuoteModalOpen}
        project={selectedProject}
        quoteForm={quoteForm}
        isLoading={isLoading}
        onClose={handleCloseQuoteModal}
        onSubmit={handleSubmitQuote}
        onFormChange={handleQuoteFormChange}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}
