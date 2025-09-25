"use client"

import { X } from "lucide-react"

interface Quote {
  id: string
  projectTitle: string
  totalAmount: number
  laborCost: number
  materialsCost: number
  extrasCost: number
  laborHours: number
  notes: string
  status: string
  submittedAt: string
  homeowner: { name: string }
}

interface QuoteDetailModalProps {
  isOpen: boolean
  quote: Quote | null
  onClose: () => void
  formatDate: (date: string) => string
  formatCurrency: (amount: number) => string
  getStatusColor: (status: string) => string
}

export function QuoteDetailModal({
  isOpen,
  quote,
  onClose,
  formatDate,
  formatCurrency,
  getStatusColor,
}: QuoteDetailModalProps) {
  if (!isOpen || !quote) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl bg-white rounded-md shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-gray-900">Quote Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{quote.projectTitle}</h4>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}
          >
            {quote.status.charAt(0) + quote.status.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Cost Breakdown</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Labor Cost:</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(quote.laborCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Materials Cost:</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(quote.materialsCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Extras Cost:</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(quote.extrasCost)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Total Amount:</span>
                  <span className="text-sm font-medium text-blue-600">{formatCurrency(quote.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">Project Details</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Labor Hours:</span>
                <span className="text-sm font-medium text-gray-900">{quote.laborHours} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Submitted:</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(quote.submittedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Homeowner:</span>
                <span className="text-sm font-medium text-gray-900">{quote.homeowner.name}</span>
              </div>
            </div>
          </div>
        </div>

        {quote.notes && (
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">{quote.notes}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
