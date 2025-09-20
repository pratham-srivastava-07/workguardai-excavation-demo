import { prismaClient } from "../db";

export async function getExistingContractor(id: string) {
    try {
         const existing = await prismaClient.contractorProfile.findUnique({
             where: { userId: id },
         });

        return existing;
    } catch(err: any) {
        return {error: `An error occured ${err}`}
    }
}

export default async function registerContractor(id: string, companyName: string, services: any, description: string) {
    try {
        const newContractor = await prismaClient.contractorProfile.create({
            data: {
                userId: id,
                companyName: companyName,
                services: services,
                description: description,
            }
        })
        return newContractor;
    } catch(err: any) {
        return {error: `An error occured while registering contractor ${err}`}
    }
}

export async function getUniqueContractorProfile(id: string) {
    try {
        const profile = await prismaClient.contractorProfile.findUnique({
            where: {id: id},
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        })
        return profile;
    } catch(error: any) {
        return {error: `${error}`}
    }
}

export async function getUniqueContractorProfileById(id: string) {
    try {
        const result = await prismaClient.contractorProfile.findUnique({
            where: {
                userId: id
            }
        })

        return result;
    } catch(error: any) {
        console.log(`Error occured while getting a unique contractor ${error}`)
        return error;
    }
}

