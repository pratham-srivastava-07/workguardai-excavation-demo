import { DashboardHeader } from "../dashboard-components/dashboard-header";
import { ProjectCards } from "../dashboard-components/project-cards";
import { DashboardSidebar } from "../layout/dashboard-sidebar";
import { RightSidebar } from "../layout/right-sidebar";
import { TasksSection } from "../sections/tasks-section";


export default function HomeownerDashboard() {
  return (
    <div className="min-h-screen bg-black text-white dark">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />

          <main className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* <ProjectCards /> */}
              <TasksSection />
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  )
}
