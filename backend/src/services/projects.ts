import { prismaClient } from "../db";

interface CreateProjectInput {
  title: string;
  description?: string;
  projectType: string;
  size?: number; // m²
  materials?: string; // materials preference
  budgetMin?: number;
  budgetMax?: number;
  homeownerId: string;
}

// Create a new project
export async function createProject(data: CreateProjectInput) {
  try {
    // Calculate predictive cost based on project type and size
    const predictedCost = calculatePredictiveCost(data.projectType, data.size);
    
    const project = await prismaClient.project.create({
      data: {
        ...data,
        predictedCost,
        status: "OPEN"
      },
      include: {
        homeowner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return { data: project };
  } catch (error: any) {
    console.error('Error creating project:', error);
    return { error: `Error creating project: ${error.message}` };
  }
}

// Get all projects (for general browsing)
export async function getAllProjects() {
  try {
    const projects = await prismaClient.project.findMany({
      include: {
        homeowner: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            quotes: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return { data: projects };
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return { error: `Error fetching projects: ${error.message}` };
  }
}

// Get available projects for contractors (projects they haven't quoted on)
export async function getAvailableProjectsForContractor(contractorId: string) {
  try {
    const projects = await prismaClient.project.findMany({
      where: {
        status: "OPEN",
        quotes: {
          none: {
            contractorId: contractorId
          }
        }
      },
      include: {
        homeowner: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            quotes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { data: projects };
  } catch (error: any) {
    console.error('Error fetching available projects:', error);
    return { error: `Error fetching available projects: ${error.message}` };
  }
}

// Get single project with details
export async function getProjectById(projectId: string, userId?: string, userRole?: string) {
  try {
    const project = await prismaClient.project.findUnique({
      where: { id: projectId },
      include: {
        homeowner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        quotes: {
          include: {
            contractor: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            },
            lineItems: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        milestones: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!project) {
      return { error: "Project not found" };
    }

    // Filter sensitive data based on user role and ownership
    if (userRole === 'CONTRACTOR' && userId) {
      // Contractors can only see their own quote details, others are summarized
      const contractorProfile = await prismaClient.contractorProfile.findUnique({
        where: { userId: userId }
      });

      if (contractorProfile) {
        const filteredProject = {
          ...project,
          quotes: project.quotes.map(quote => {
            if (quote.contractorId === contractorProfile.id) {
              return quote; // Full details for own quote
            } else {
              // Summarized info for other quotes - maintain type consistency
              return {
                id: quote.id,
                projectId: quote.projectId,
                contractorId: quote.contractorId,
                totalAmount: quote.totalAmount,
                status: quote.status,
                createdAt: quote.createdAt,
                updatedAt: quote.updatedAt,
                laborHours: null,
                laborCost: null,
                materialsCost: null,
                extrasCost: null,
                notes: null, // Use null instead of undefined
                validUntil: quote.validUntil,
                contractor: quote.contractor,
                lineItems: [] as any[] // Empty array with proper typing
              };
            }
          })
        };

        return { data: filteredProject };
      }
    }

    return { data: project };
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return { error: `Error fetching project: ${error.message}` };
  }
}

// Get projects by homeowner
export async function getProjectsByHomeowner(homeownerId: string) {
  try {
    const projects = await prismaClient.project.findMany({
      where: {
        homeownerId: homeownerId
      },
      include: {
        _count: {
          select: {
            quotes: true,
            milestones: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { data: projects };
  } catch (error: any) {
    console.error('Error fetching homeowner projects:', error);
    return { error: `Error fetching homeowner projects: ${error.message}` };
  }
}

// Basic predictive cost calculator (rule-based for MVP)
function calculatePredictiveCost(projectType: string, size?: number): number | null {
  if (!size) return null;

  const costPerSqm: Record<string, number> = {
    'kitchen_renovation': 1500, // €1500 per m²
    'bathroom_renovation': 2000, // €2000 per m²
    'living_room_renovation': 800, // €800 per m²
    'bedroom_renovation': 600, // €600 per m²
    'full_house_renovation': 1200, // €1200 per m²
    'outdoor_renovation': 400, // €400 per m²
  };

  const baseRate = costPerSqm[projectType.toLowerCase()] || 1000;
  return Math.round(baseRate * size);
}

// Update project status
export async function updateProjectStatus(projectId: string, status: string, homeownerId: string) {
  try {
    // Verify ownership
    const project = await prismaClient.project.findUnique({
      where: { id: projectId },
      select: { homeownerId: true }
    });

    if (!project) {
      return { error: "Project not found" };
    }

    if (project.homeownerId !== homeownerId) {
      return { error: "Unauthorized: You don't own this project" };
    }

    const updatedProject = await prismaClient.project.update({
      where: { id: projectId },
      data: { status }
    });

    return { data: updatedProject };
  } catch (error: any) {
    console.error('Error updating project status:', error);
    return { error: `Error updating project status: ${error.message}` };
  }
}


export async function getHomeOwnerProjectById(id: string) {
    try {
        const result =  await prismaClient.project.findUnique({
            where: { id: id },
            select: { homeownerId: true }
        });

        return result;
    } catch(error: any){
        console.log(`Error getting homeowner project ${error}`);
    }
}