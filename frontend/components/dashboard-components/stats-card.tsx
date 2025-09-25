import { Briefcase, Send, CheckCircle, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  availableProjects: number
  myQuotes: number
  acceptedQuotes: number
  totalValue: string
}

export function StatsCards({ availableProjects, myQuotes, acceptedQuotes, totalValue }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Available Projects</p>
            <p className="text-2xl font-semibold text-gray-900">{availableProjects}</p>
          </div>
          <Briefcase className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">My Quotes</p>
            <p className="text-2xl font-semibold text-gray-900">{myQuotes}</p>
          </div>
          <Send className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Accepted Quotes</p>
            <p className="text-2xl font-semibold text-gray-900">{acceptedQuotes}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Value</p>
            <p className="text-2xl font-semibold text-gray-900">{totalValue}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  )
}
