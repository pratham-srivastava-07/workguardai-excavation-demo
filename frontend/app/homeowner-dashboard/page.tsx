"use client";
import HomeownerDashboard from "@/components/dashboard/HomeownerDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['HOMEOWNER']}>
                <HomeownerDashboard />
            </RoleProtectedRoute>
        </ProtectedRoute>
    );
}