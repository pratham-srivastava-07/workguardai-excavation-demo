import prisma from '../prisma';
import { Role } from '@prisma/client';

export class AssignmentService {

    // Find existing assignment or create new one
    async findOrCreateAssignment(homeownerId: string): Promise<{ roomId: string, companyId: string, homeownerId: string } | null> {
        try {
            // 1. Check if homeowner already has an assignment
            const existing = await prisma.assignment.findUnique({
                where: { homeownerId },
                include: { room: true }
            });

            if (existing && existing.isActive) {
                return { roomId: existing.roomId, companyId: existing.companyId, homeownerId: existing.homeownerId };
            }

            // 2. Find available company
            // Improve: Find company with least active assignments
            const companies = await prisma.user.findMany({
                where: { role: 'COMPANY' },
                select: { id: true }
            });

            if (companies.length === 0) {
                console.warn('No companies available for assignment');
                return null;
            }

            // Simple load balancing: pick company with fewest active assignments
            let selectedCompanyId = companies[0].id;
            let minAssignments = Infinity;

            for (const company of companies) {
                const count = await prisma.assignment.count({
                    where: { companyId: company.id, isActive: true }
                });
                if (count < minAssignments) {
                    minAssignments = count;
                    selectedCompanyId = company.id;
                }
            }

            // 3. Create new Assignment and Room
            // Transaction to ensure atomicity
            const result = await prisma.$transaction(async (tx) => {
                const room = await tx.chatRoom.create({ data: {} });

                const assignment = await tx.assignment.create({
                    data: {
                        homeownerId,
                        companyId: selectedCompanyId,
                        roomId: room.id,
                        isActive: true
                    }
                });
                return assignment;
            });

            return { roomId: result.roomId, companyId: result.companyId, homeownerId: result.homeownerId };

        } catch (error) {
            console.error('Error in findOrCreateAssignment:', error);
            throw error;
        }
    }

    async getAssignmentByRoomId(roomId: string) {
        return prisma.assignment.findUnique({
            where: { roomId },
            include: { homeowner: true, company: true }
        });
    }

    async getAssignmentsForCompany(companyId: string) {
        return prisma.assignment.findMany({
            where: { companyId, isActive: true },
            include: { room: true, homeowner: true }
        });
    }
}

export const assignmentService = new AssignmentService();
