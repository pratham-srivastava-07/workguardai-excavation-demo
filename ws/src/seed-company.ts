
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Checking for company users...');
    const companies = await prisma.user.findMany({
        where: { role: 'COMPANY' },
    });

    console.log(`Found ${companies.length} company users.`);

    if (companies.length === 0) {
        console.log('No company found. Creating a default company user...');
        try {
            const newCompany = await prisma.user.create({
                data: {
                    email: 'company@renowise.com',
                    password: 'password123', // In a real app this should be hashed, but for dev/test this might pass if auth doesn't strictly hash check on create or if we use simple login
                    name: 'Renowise Support',
                    role: 'COMPANY',
                    companyProfile: {
                        create: {
                            companyName: 'Renowise HQ',
                            description: 'Official support channel'
                        }
                    }
                }
            });
            console.log('Created company user:', newCompany);
        } catch (e) {
            console.error("Error creating company:", e);
        }
    } else {
        console.log('Company users exist:', companies.map(c => c.email));
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
