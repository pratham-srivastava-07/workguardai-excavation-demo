import { PrismaClient, Role, PostType, PostStatus, OfferStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.postAuditLog.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.post.deleteMany();
  await prisma.quoteLineItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contractorProfile.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.cityProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const homeowner1 = await prisma.user.create({
    data: {
      email: 'homeowner1@example.com',
      password: hashedPassword,
      name: 'John Homeowner',
      role: Role.HOMEOWNER,
    },
  });

  const homeowner2 = await prisma.user.create({
    data: {
      email: 'homeowner2@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: Role.HOMEOWNER,
    },
  });

  const company1 = await prisma.user.create({
    data: {
      email: 'company1@example.com',
      password: hashedPassword,
      name: 'BuildCorp Admin',
      role: Role.COMPANY,
    },
  });

  const company2 = await prisma.user.create({
    data: {
      email: 'company2@example.com',
      password: hashedPassword,
      name: 'RenovatePro Admin',
      role: Role.COMPANY,
    },
  });

  const city1 = await prisma.user.create({
    data: {
      email: 'city1@example.com',
      password: hashedPassword,
      name: 'Lisbon City Admin',
      role: Role.CITY,
    },
  });

  // Create Company Profiles
  const companyProfile1 = await prisma.companyProfile.create({
    data: {
      userId: company1.id,
      companyName: 'BuildCorp Construction',
      description: 'Professional construction and renovation services',
      verified: true,
      latitude: 38.7223,
      longitude: -9.1393,
    },
  });

  const companyProfile2 = await prisma.companyProfile.create({
    data: {
      userId: company2.id,
      companyName: 'RenovatePro Solutions',
      description: 'Expert renovation and material supply',
      verified: true,
      latitude: 38.7145,
      longitude: -9.1401,
    },
  });

  // Create City Profile
  const cityProfile1 = await prisma.cityProfile.create({
    data: {
      userId: city1.id,
      cityName: 'Lisbon Municipality',
      description: 'City of Lisbon official materials and spaces',
      verified: true,
      latitude: 38.7223,
      longitude: -9.1393,
    },
  });

  // Create Posts - Materials
  const materialPost1 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.AVAILABLE,
      userId: homeowner1.id,
      title: 'Roof Tiles - Excellent Condition',
      description: 'High-quality ceramic roof tiles from recent renovation. Approximately 200 pieces available. Perfect condition, no cracks or damage.',
      subtype: 'roof tiles',
      quantity: 200,
      unit: 'pieces',
      price: 50000, // €500.00
      latitude: 38.7200,
      longitude: -9.1400,
      address: 'Rua da Prata, 1100-150 Lisboa',
      condition: 'used',
      availabilityDate: new Date('2024-12-20'),
      pickupAllowed: true,
      transportNeeded: false,
      canCompanyCollect: true,
      permitForReuse: true,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      ],
    },
  });

  const materialPost2 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.AVAILABLE,
      userId: companyProfile1.userId,
      companyId: companyProfile1.id,
      title: 'Wooden Planks - Various Sizes',
      description: 'Reclaimed wooden planks from demolition. Various sizes available. Good condition, some may need sanding.',
      subtype: 'planks',
      quantity: 50,
      unit: 'pieces',
      price: 30000, // €300.00
      latitude: 38.7150,
      longitude: -9.1350,
      address: 'Avenida da Liberdade, 1250-096 Lisboa',
      condition: 'used',
      availabilityDate: new Date('2024-12-15'),
      pickupAllowed: true,
      transportNeeded: false,
      canCompanyCollect: true,
      permitForReuse: true,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      ],
    },
  });

  const materialPost3 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.AVAILABLE,
      userId: cityProfile1.userId,
      cityId: cityProfile1.id,
      title: 'Sand and Gravel - Large Quantity',
      description: 'Construction-grade sand and gravel from city project. Available in bulk quantities.',
      subtype: 'sand',
      quantity: 100,
      unit: 'm³',
      price: 150000, // €1500.00
      latitude: 38.7250,
      longitude: -9.1450,
      address: 'Parque das Nações, 1990-223 Lisboa',
      condition: 'new',
      availabilityDate: new Date('2024-12-10'),
      pickupAllowed: false,
      transportNeeded: true,
      canCompanyCollect: true,
      permitForReuse: true,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ],
    },
  });

  // Create Posts - Services
  const servicePost1 = await prisma.post.create({
    data: {
      type: PostType.SERVICE,
      status: PostStatus.AVAILABLE,
      userId: companyProfile1.userId,
      companyId: companyProfile1.id,
      title: 'Demolition Services',
      description: 'Professional demolition services for residential and commercial properties. Licensed and insured.',
      subtype: 'demolition',
      latitude: 38.7223,
      longitude: -9.1393,
      address: 'BuildCorp Construction, Lisboa',
      hourlyRate: 5000, // €50.00/hour
      dailyRate: 35000, // €350.00/day
      pickupAllowed: false,
      transportNeeded: false,
      canCompanyCollect: false,
      images: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      ],
    },
  });

  const servicePost2 = await prisma.post.create({
    data: {
      type: PostType.SERVICE,
      status: PostStatus.AVAILABLE,
      userId: companyProfile2.userId,
      companyId: companyProfile2.id,
      title: 'Transport and Delivery Services',
      description: 'Reliable transport services for construction materials. Various vehicle sizes available.',
      subtype: 'transport',
      latitude: 38.7145,
      longitude: -9.1401,
      address: 'RenovatePro Solutions, Lisboa',
      hourlyRate: 3000, // €30.00/hour
      dailyRate: 20000, // €200.00/day
      pickupAllowed: false,
      transportNeeded: false,
      canCompanyCollect: false,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ],
    },
  });

  // Create Posts - Spaces
  const spacePost1 = await prisma.post.create({
    data: {
      type: PostType.SPACE,
      status: PostStatus.AVAILABLE,
      userId: cityProfile1.userId,
      cityId: cityProfile1.id,
      title: 'Storage Space Available',
      description: 'Large storage space available for construction materials. Secure and accessible location.',
      subtype: 'storage',
      quantity: 200,
      unit: 'm²',
      price: 50000, // €500.00/month
      latitude: 38.7300,
      longitude: -9.1500,
      address: 'City Storage Facility, Lisboa',
      rentalDuration: 'monthly',
      availabilityDate: new Date('2024-12-01'),
      pickupAllowed: false,
      transportNeeded: false,
      canCompanyCollect: false,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ],
    },
  });

  // Create Offers
  const offer1 = await prisma.offer.create({
    data: {
      postId: materialPost1.id,
      userId: companyProfile1.userId,
      companyId: companyProfile1.id,
      amount: 45000, // €450.00
      message: 'We are interested in purchasing all roof tiles. Can collect this week.',
      status: OfferStatus.PENDING,
    },
  });

  const offer2 = await prisma.offer.create({
    data: {
      postId: materialPost2.id,
      userId: homeowner2.id,
      amount: 25000, // €250.00
      message: 'Interested in the wooden planks for my renovation project.',
      status: OfferStatus.PENDING,
    },
  });

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      homeownerId: homeowner1.id,
      title: 'Kitchen Renovation',
      description: 'Complete kitchen renovation including new cabinets, countertops, and appliances.',
      projectType: 'kitchen_renovation',
      size: 25.5,
      materials: 'Modern cabinets, quartz countertops',
      budgetMin: 15000,
      budgetMax: 25000,
      status: 'OPEN',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      homeownerId: homeowner2.id,
      title: 'Bathroom Remodel',
      description: 'Full bathroom renovation with new tiles, fixtures, and plumbing.',
      projectType: 'bathroom_renovation',
      size: 12.0,
      materials: 'Ceramic tiles, modern fixtures',
      budgetMin: 8000,
      budgetMax: 12000,
      status: 'OPEN',
    },
  });

  // Create Audit Logs
  await prisma.postAuditLog.create({
    data: {
      postId: materialPost1.id,
      userId: homeowner1.id,
      action: 'CREATE',
    },
  });

  await prisma.postAuditLog.create({
    data: {
      postId: materialPost2.id,
      userId: companyProfile1.userId,
      action: 'CREATE',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created:`);
  console.log(`- 5 Users (2 Homeowners, 2 Companies, 1 City)`);
  console.log(`- 2 Company Profiles`);
  console.log(`- 1 City Profile`);
  console.log(`- 6 Posts (3 Materials, 2 Services, 1 Space)`);
  console.log(`- 2 Offers`);
  console.log(`- 2 Projects`);
  console.log(`- Audit Logs`);
  console.log(`\nTest credentials:`);
  console.log(`Email: homeowner1@example.com / password: password123`);
  console.log(`Email: company1@example.com / password: password123`);
  console.log(`Email: city1@example.com / password: password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

