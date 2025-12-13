import CityDashboard from "@/components/dashboard/CityDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";

export default function CityDashboardPage() {
    return (
        <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['CITY']}>
                <CityDashboard />
            </RoleProtectedRoute>
        </ProtectedRoute>
    );
}