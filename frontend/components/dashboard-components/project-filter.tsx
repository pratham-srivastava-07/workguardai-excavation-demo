"use client"

import { Search, Filter } from "lucide-react"

interface ProjectFiltersProps {
  searchTerm: string
  selectedType: string
  budgetRange: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onBudgetChange: (value: string) => void
  onClearFilters: () => void
  projectTypeLabels: Record<string, string>
}

export function ProjectFilters({
  searchTerm,
  selectedType,
  budgetRange,
  onSearchChange,
  onTypeChange,
  onBudgetChange,
  onClearFilters,
  projectTypeLabels,
}: ProjectFiltersProps) {
  return (
    <div className="bg-white text-black rounded-lg cursor-pointer shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Projects</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title or description..."
              className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">Project Type</label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {Object.entries(projectTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="cursor-pointer">
          <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">Budget Range</label>
          <select
            value={budgetRange}
            onChange={(e) => onBudgetChange(e.target.value)}
            className="w-full rounded-md border cursor-pointer border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Budgets</option>
            <option value="low">Under €10,000</option>
            <option value="medium">€10,000 - €20,000</option>
            <option value="high">Over €20,000</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>
    </div>
  )
}
