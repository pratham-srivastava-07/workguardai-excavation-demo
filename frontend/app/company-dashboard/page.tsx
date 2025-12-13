import CompanyDashboard from "@/components/dashboard/CompanyDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";

export default function ContractorDashboardPage() {
    return (
        <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['COMPANY']}>
                <CompanyDashboard />
            </RoleProtectedRoute>
        </ProtectedRoute>
    );
}