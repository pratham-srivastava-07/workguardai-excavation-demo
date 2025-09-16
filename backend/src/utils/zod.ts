import zod from "zod"

export const signupBody = zod.object({
    name: zod.string(),
    email: zod.email(),
    password: zod.string().min(6)
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
  title: zod.string().min(3, "Title is required"),
  description: zod.string().optional(),
  projectType: zod.string().min(2, "Project type is required"),
  budgetMin: zod.number().int().positive().optional(),
  budgetMax: zod.number().int().positive().optional(),
});