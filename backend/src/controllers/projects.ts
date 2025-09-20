import { Request, Response } from "express";
import { 
  createProject, 
  getAllProjects, 
  getAvailableProjectsForContractor,
  getProjectById,
  getProjectsByHomeowner,
  updateProjectStatus
} from "../services/projects";
import { getUniqueContractorProfileById } from "../services/contractor";


// Register a new project
export default async function registerProject(req: Request, res: Response) {
  try {
    if (!(req as any).user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await createProject({
      ...req.body,
      homeownerId: (req as any).user.id,
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json(result.data);
  } catch (err: any) {
    console.error("Error creating project:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get cost estimate for a project (predictive calculator)
export async function getEstimateController(req: Request, res: Response) {
  try {
    const { projectType, size } = req.query;

    if (!projectType || !size) {
      return res.status(400).json({ 
        error: "Project type and size are required" 
      });
    }

    // Use the same calculation logic as in createProject
    const costPerSqm: Record<string, number> = {
      'kitchen_renovation': 1500,
      'bathroom_renovation': 2000,
      'living_room_renovation': 800,
      'bedroom_renovation': 600,
      'full_house_renovation': 1200,
      'outdoor_renovation': 400,
    };

    const baseRate = costPerSqm[projectType as string] || 1000;
    const estimatedCost = Math.round(baseRate * Number(size));

    // Provide a range (±20%)
    const minEstimate = Math.round(estimatedCost * 0.8);
    const maxEstimate = Math.round(estimatedCost * 1.2);

    return res.json({
      projectType,
      size: Number(size),
      estimatedCost,
      estimateRange: {
        min: minEstimate,
        max: maxEstimate
      },
      note: "This is a rough estimate. Actual costs may vary based on specific requirements and materials."
    });

  } catch (err: any) {
    console.error("Error calculating estimate:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Browse projects - different behavior based on user role
export async function browseProjects(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    
    if (!user) {
      // Public browsing - limited info
      const result = await getAllProjects();
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      
      // Remove sensitive homeowner info for public view
      const publicProjects = result.data?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        projectType: project.projectType,
        budgetMin: project.budgetMin,
        budgetMax: project.budgetMax,
        predictedCost: project.predictedCost,
        status: project.status,
        createdAt: project.createdAt,
        quoteCount: project._count.quotes
      }));
      
      return res.json(publicProjects);
    }

    if (user.role === 'CONTRACTOR') {
      // Get contractor profile and show available projects
      const contractorProfile = await getUniqueContractorProfileById(user.id)
      if (!contractorProfile) {
        return res.status(403).json({ 
          error: "Please complete your contractor profile first" 
        });
      }

      const result = await getAvailableProjectsForContractor(contractorProfile.id);
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      
      return res.json(result.data);
    }

    if (user.role === 'HOMEOWNER') {
      // Show homeowner's own projects
      const result = await getProjectsByHomeowner(user.id);
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      
      return res.json(result.data);
    }

    return res.status(403).json({ error: "Invalid user role" });

  } catch (err: any) {
    console.error("Error browsing projects:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get single project details
export async function getProjectDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const result = await getProjectById(
      id, 
      user?.id, 
      user?.role
    );

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    // Check permissions for private project details
    const project = result.data;
    if (user && user.role === 'HOMEOWNER' && project?.homeownerId !== user.id) {
      // Homeowners can only see full details of their own projects
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(project);

  } catch (err: any) {
    console.error("Error fetching project details:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update project status (homeowner only)
export async function updateProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = (req as any).user;

    if (!user || user.role !== 'HOMEOWNER') {
      return res.status(403).json({ error: "Only homeowners can update projects" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await updateProjectStatus(id, status, user.id);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result.data);

  } catch (err: any) {
    console.error("Error updating project:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}