import { Request, Response } from "express";
import { contractorBody } from "../utils/zod";
import registerContractor, { getExistingContractor, getUniqueContractorProfile } from "../services/contractor";

// register contractor
export default async function registerController(req: Request, res: Response) {
    const parsedBody = contractorBody.safeParse(req.body);

    if(!parsedBody.success) {
        return res.status(400).json({
            message: `Invalid inputs detected`
        })
    }

    const {companyName, services, description} = parsedBody.data;

    const existingContractor = await getExistingContractor((req as any).user.id);

     if (existingContractor) {
        return res.status(400).json({ error: "Contractor profile already exists" });
    }

    const newContractor = await registerContractor((req as any).user.id, companyName, services, description);

    return res.status(201).json({
        profile: newContractor
    })
}

// updating contractor profile 
export async function updateContractorController() {}


// to get the profile of contractor
export async function profileController(req: Request, res: Response) {
    const { id } = req.params;

    const profile = await getUniqueContractorProfile(id);

    if(!profile) {
        return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json({
        profile: profile 
    })
}