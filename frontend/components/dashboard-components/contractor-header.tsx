import { Home } from "lucide-react"

interface ContractorHeaderProps {
  companyName: string
  userEmail: string
  userInitials: string
}

export function ContractorHeader({ companyName, userEmail, userInitials }: ContractorHeaderProps) {
  return (
    <header className="shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold">RenoWise</h1>
            </div>
            {/* <span className="text-sm">Contractor Dashboard</span> */}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-right">
              <div className="font-medium">{companyName}</div>
              <div>{userEmail}</div>
            </div>
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{userInitials}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
