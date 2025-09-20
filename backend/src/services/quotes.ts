
// services/quotes.ts 
import { prismaClient } from "../db";

// Submit a quote (contractors)
export async function submitQuote(data: {
  projectId: string;
  contractorId: string;
  totalAmount: number;
  laborHours?: number;
  laborCost?: number;
  materialsCost?: number;
  notes?: string;
}) {
  try {
    const quote = await prismaClient.quote.create({
      data: {
        projectId: data.projectId,
        contractorId: data.contractorId,
        totalAmount: data.totalAmount,
        laborHours: data.laborHours,
        laborCost: data.laborCost,
        materialsCost: data.materialsCost,
        notes: data.notes,
      },
      include: {
        contractor: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      }
    });

    return { data: quote };
  } catch (error: any) {
    return { error: `Error submitting quote: ${error.message}` };
  }
}

// Get quotes for a project (homeowners)
export async function getProjectQuotes(projectId: string) {
  try {
    const quotes = await prismaClient.quote.findMany({
      where: { projectId },
      include: {
        contractor: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { data: quotes };
  } catch (error: any) {
    return { error: `Error fetching quotes: ${error.message}` };
  }
}

// Accept/reject quote (homeowners)
export async function updateQuoteStatus(
  quoteId: string, 
  status: 'ACCEPTED' | 'REJECTED', 
  homeownerId: string
) {
  try {
    // Verify ownership
    const quote = await prismaClient.quote.findUnique({
      where: { id: quoteId },
      include: { project: true }
    });

    if (!quote || quote.project.homeownerId !== homeownerId) {
      return { error: "Quote not found or access denied" };
    }

    const updatedQuote = await prismaClient.quote.update({
      where: { id: quoteId },
      data: { status }
    });

    return { data: updatedQuote };
  } catch (error: any) {
    return { error: `Error updating quote: ${error.message}` };
  }
}