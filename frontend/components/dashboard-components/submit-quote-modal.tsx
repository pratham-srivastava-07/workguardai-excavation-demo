"use client"

import type React from "react"

import { X, Euro, Clock, CheckCircle, Send } from "lucide-react"

interface Project {
  id: string
  title: string
  budgetMin: number
  budgetMax: number
  predictedCost: number
}

interface QuoteForm {
  totalAmount: string
  laborHours: string
  laborCost: string
  materialsCost: string
  extrasCost: string
  notes: string
}

interface SubmitQuoteModalProps {
  isOpen: boolean
  project: Project | null
  quoteForm: QuoteForm
  isLoading: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onFormChange: (field: keyof QuoteForm, value: string) => void
  formatCurrency: (amount: number) => string
}

export function SubmitQuoteModal({
  isOpen,
  project,
  quoteForm,
  isLoading,
  onClose,
  onSubmit,
  onFormChange,
  formatCurrency,
}: SubmitQuoteModalProps) {
  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl bg-white rounded-md shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-gray-900">Submit Quote for {project.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Euro className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-900">Project Budget Range</span>
          </div>
          <p className="text-blue-700">
            {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
          </p>
          <p className="text-sm text-blue-600 mt-1">Predicted cost: {formatCurrency(project.predictedCost)}</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (EUR) *</label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={quoteForm.totalAmount}
                  onChange={(e) => onFormChange("totalAmount", e.target.value)}
                  placeholder="Enter total quote amount"
                  className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Labor Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={quoteForm.laborHours}
                  onChange={(e) => onFormChange("laborHours", e.target.value)}
                  placeholder="Hours required"
                  className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Cost Breakdown (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Labor Cost (EUR)</label>
                <input
                  type="number"
                  value={quoteForm.laborCost}
                  onChange={(e) => onFormChange("laborCost", e.target.value)}
                  placeholder="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Materials Cost (EUR)</label>
                <input
                  type="number"
                  value={quoteForm.materialsCost}
                  onChange={(e) => onFormChange("materialsCost", e.target.value)}
                  placeholder="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Additional Costs (EUR)</label>
                <input
                  type="number"
                  value={quoteForm.extrasCost}
                  onChange={(e) => onFormChange("extrasCost", e.target.value)}
                  placeholder="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={quoteForm.notes}
              onChange={(e) => onFormChange("notes", e.target.value)}
              placeholder="Include any specific details about your approach, timeline, materials, or other important information..."
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Quote Submission Guidelines</p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li>• Be competitive but realistic with your pricing</li>
                  <li>• Include all necessary costs in your total amount</li>
                  <li>• Provide clear timeline expectations in your notes</li>
                  <li>• Mention any certifications or special expertise</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!quoteForm.totalAmount || isLoading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Quote
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
