import zod from "zod"

export const signupBody = zod.object({
    name: zod.string(),
    email: zod.email(),
    password: zod.string().min(6),
    role: zod.enum(["HOMEOWNER", "CONTRACTOR"]).optional(),
})

export type SignupBody = zod.infer<typeof signupBody>;

export const signinBody = zod.object({
    email: zod.email(),
    password: zod.string().min(6)
})

export const contractorBody = zod.object({
    companyName: zod.string(),
    services: zod.json(),
    description: zod.string(),
})

export type ContractorBody = zod.infer<typeof contractorBody>;

export const projectBodySchema = zod.object({
  title: zod.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  
  description: zod.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  
  projectType: zod.enum([
    "kitchen_renovation",
    "bathroom_renovation", 
    "living_room_renovation",
    "bedroom_renovation",
    "full_house_renovation",
    "outdoor_renovation",
    "other"
  ], {
    message: "Invalid project type"
  }),
  
  size: zod.number()
    .min(1, "Size must be at least 1 m²")
    .max(1000, "Size cannot exceed 1000 m²")
    .optional(),
  
  materials: zod.string()
    .max(200, "Materials description too long")
    .optional(),
  
  budgetMin: zod.number()
    .min(100, "Minimum budget must be at least €100")
    .optional(),
  
  budgetMax: zod.number()
    .min(100, "Maximum budget must be at least €100")
    .optional()
}).refine((data: any) => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMax >= data.budgetMin;
  }
  return true;
}, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["budgetMax"]
});

// Project update schema
export const projectUpdateSchema = zod.object({
  status: zod.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"], {
    message: "Invalid project type"
  })
});

// Quote submission schema
export const quoteSubmissionSchema = zod.object({
  projectId: zod.string().cuid("Invalid project ID"),
  
  totalAmount: zod.number()
    .min(1, "Total amount must be positive"),
  
  laborHours: zod.number()
    .min(0, "Labor hours cannot be negative")
    .optional(),
  
  laborCost: zod.number()
    .min(0, "Labor cost cannot be negative")
    .optional(),
  
  materialsCost: zod.number()
    .min(0, "Materials cost cannot be negative")
    .optional(),
  
  extrasCost: zod.number()
    .min(0, "Extras cost cannot be negative")
    .optional(),
  
  notes: zod.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  
  validUntil: zod.string()
    .datetime("Invalid date format")
    .optional(),
  
  lineItems: zod.array(zod.object({
    category: zod.string().min(1, "Category is required"),
    description: zod.string().min(1, "Description is required"),
    quantity: zod.number().min(0.01, "Quantity must be positive"),
    unitPrice: zod.number().min(0.01, "Unit price must be positive")
  })).optional()
});

// Quote status update schema
export const quoteStatusUpdateSchema = zod.object({
  status: zod.enum(["ACCEPTED", "REJECTED"], {
    message: "Invalid project type"
  })
});