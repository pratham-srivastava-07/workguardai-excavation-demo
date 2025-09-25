"use client"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  availableCount: number
  quotesCount: number
}

export function TabNavigation({ activeTab, onTabChange, availableCount, quotesCount }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange("available")}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === "available"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Available Projects ({availableCount})
        </button>
        <button
          onClick={() => onTabChange("quotes")}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === "quotes"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          My Quotes ({quotesCount})
        </button>
      </nav>
    </div>
  )
}
