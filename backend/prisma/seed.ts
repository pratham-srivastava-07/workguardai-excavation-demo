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

  console.log('👥 Creating users...');

  // Create Homeowners
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

  const homeowner3 = await prisma.user.create({
    data: {
      email: 'homeowner3@example.com',
      password: hashedPassword,
      name: 'Carlos Silva',
      role: Role.HOMEOWNER,
    },
  });

  // Create Companies
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

  const company3 = await prisma.user.create({
    data: {
      email: 'company3@example.com',
      password: hashedPassword,
      name: 'EcoBuild Admin',
      role: Role.COMPANY,
    },
  });

  // Create City
  const city1 = await prisma.user.create({
    data: {
      email: 'city1@example.com',
      password: hashedPassword,
      name: 'Lisbon City Admin',
      role: Role.CITY,
    },
  });

  console.log('🏢 Creating company profiles...');

  // Create Company Profiles
  const companyProfile1 = await prisma.companyProfile.create({
    data: {
      userId: company1.id,
      companyName: 'BuildCorp Construction',
      description: 'Professional construction and renovation services with 15+ years of experience',
      verified: true,
      latitude: 38.7223,
      longitude: -9.1393,
    },
  });

  const companyProfile2 = await prisma.companyProfile.create({
    data: {
      userId: company2.id,
      companyName: 'RenovatePro Solutions',
      description: 'Expert renovation and material supply company',
      verified: true,
      latitude: 38.7145,
      longitude: -9.1401,
    },
  });

  const companyProfile3 = await prisma.companyProfile.create({
    data: {
      userId: company3.id,
      companyName: 'EcoBuild Sustainable',
      description: 'Sustainable construction and material recycling specialists',
      verified: false,
      latitude: 38.7300,
      longitude: -9.1450,
    },
  });

  console.log('🏛️ Creating city profile...');

  // Create City Profile
  const cityProfile1 = await prisma.cityProfile.create({
    data: {
      userId: city1.id,
      cityName: 'Lisbon Municipality',
      description: 'City of Lisbon official materials and spaces management',
      verified: true,
      latitude: 38.7223,
      longitude: -9.1393,
    },
  });

  console.log('📦 Creating posts...');

  // Create Material Posts by Homeowners
  const materialPost1 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.AVAILABLE,
      userId: homeowner1.id,
      title: 'Roof Tiles - Excellent Condition',
      description: 'High-quality ceramic roof tiles from recent renovation. Approximately 200 pieces available. Perfect condition, no cracks or damage. Ready for immediate pickup.',
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
      hazardousMaterials: false,
      structuralItems: false,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      ],
    },
  });

  const materialPost2 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.RESERVED,
      userId: homeowner2.id,
      title: 'Reclaimed Wooden Flooring',
      description: 'Beautiful reclaimed wooden flooring from 1950s building. Approximately 30m². Good condition, needs light sanding.',
      subtype: 'flooring',
      quantity: 30,
      unit: 'm²',
      price: 120000, // €1200.00
      latitude: 38.7150,
      longitude: -9.1350,
      address: 'Avenida da Liberdade, 1250-096 Lisboa',
      condition: 'used',
      availabilityDate: new Date('2024-12-15'),
      pickupAllowed: true,
      transportNeeded: false,
      canCompanyCollect: true,
      permitForReuse: true,
      hazardousMaterials: false,
      structuralItems: false,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ],
    },
  });

  const materialPost3 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.AVAILABLE,
      userId: homeowner3.id,
      title: 'Bathroom Tiles - White Ceramic',
      description: 'White ceramic bathroom tiles, approximately 15m². New condition, never used. Perfect for bathroom renovation.',
      subtype: 'tiles',
      quantity: 15,
      unit: 'm²',
      price: 80000, // €800.00
      latitude: 38.7250,
      longitude: -9.1420,
      address: 'Rua do Comércio, 1100-148 Lisboa',
      condition: 'new',
      availabilityDate: new Date('2024-12-18'),
      pickupAllowed: true,
      transportNeeded: false,
      canCompanyCollect: true,
      permitForReuse: true,
      hazardousMaterials: false,
      structuralItems: false,
      images: [
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      ],
    },
  });

  // Create Material Posts by Companies
  const materialPost4 = await prisma.post.create({
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
      latitude: 38.7223,
      longitude: -9.1393,
      address: 'BuildCorp Construction, Lisboa',
      condition: 'used',
      availabilityDate: new Date('2024-12-15'),
      pickupAllowed: true,
      transportNeeded: false,
      canCompanyCollect: true,
      permitForReuse: true,
      hazardousMaterials: false,
      structuralItems: false,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ],
    },
  });

  const materialPost5 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.AVAILABLE,
      userId: companyProfile2.userId,
      companyId: companyProfile2.id,
      title: 'Steel Beams - Structural Grade',
      description: 'High-quality steel beams from commercial renovation. Various lengths available. Perfect for structural projects.',
      subtype: 'steel',
      quantity: 12,
      unit: 'pieces',
      price: 250000, // €2500.00
      latitude: 38.7145,
      longitude: -9.1401,
      address: 'RenovatePro Solutions, Lisboa',
      condition: 'used',
      availabilityDate: new Date('2024-12-12'),
      pickupAllowed: false,
      transportNeeded: true,
      canCompanyCollect: true,
      permitForReuse: true,
      hazardousMaterials: false,
      structuralItems: true,
      images: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      ],
    },
  });

  // Create Material Posts by City
  const materialPost6 = await prisma.post.create({
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
      hazardousMaterials: false,
      structuralItems: false,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ],
    },
  });

  const materialPost7 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.AVAILABLE,
      userId: cityProfile1.userId,
      cityId: cityProfile1.id,
      title: 'Concrete Blocks - Reclaimed',
      description: 'Reclaimed concrete blocks from demolition site. Good condition, suitable for reuse.',
      subtype: 'concrete',
      quantity: 500,
      unit: 'pieces',
      price: 200000, // €2000.00
      latitude: 38.7280,
      longitude: -9.1480,
      address: 'Almada, 2800-000 Lisboa',
      condition: 'used',
      availabilityDate: new Date('2024-12-08'),
      pickupAllowed: true,
      transportNeeded: false,
      canCompanyCollect: true,
      permitForReuse: true,
      hazardousMaterials: false,
      structuralItems: true,
      images: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      ],
    },
  });

  const materialPost8 = await prisma.post.create({
    data: {
      type: PostType.MATERIAL,
      status: PostStatus.AVAILABLE,
      userId: cityProfile1.userId,
      cityId: cityProfile1.id,
      title: 'Hazardous Materials - Asbestos Removal',
      description: 'Asbestos-containing materials requiring professional disposal. Special handling required.',
      subtype: 'hazardous',
      quantity: 50,
      unit: 'm²',
      price: 0,
      latitude: 38.7200,
      longitude: -9.1500,
      address: 'City Waste Management Facility, Lisboa',
      condition: 'used',
      availabilityDate: new Date('2024-12-05'),
      pickupAllowed: false,
      transportNeeded: true,
      canCompanyCollect: false,
      permitForReuse: false,
      hazardousMaterials: true,
      structuralItems: false,
      images: [],
    },
  });

  // Create Service Posts
  const servicePost1 = await prisma.post.create({
    data: {
      type: PostType.SERVICE,
      status: PostStatus.AVAILABLE,
      userId: companyProfile1.userId,
      companyId: companyProfile1.id,
      title: 'Demolition Services',
      description: 'Professional demolition services for residential and commercial properties. Licensed and insured. Full cleanup included.',
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
      description: 'Reliable transport services for construction materials. Various vehicle sizes available. Same-day delivery possible.',
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

  const servicePost3 = await prisma.post.create({
    data: {
      type: PostType.SERVICE,
      status: PostStatus.AVAILABLE,
      userId: companyProfile3.userId,
      companyId: companyProfile3.id,
      title: 'Material Collection Service',
      description: 'Professional material collection and transport service. We handle pickup and delivery of construction materials.',
      subtype: 'collection',
      latitude: 38.7300,
      longitude: -9.1450,
      address: 'EcoBuild Sustainable, Lisboa',
      hourlyRate: 4000, // €40.00/hour
      dailyRate: 28000, // €280.00/day
      pickupAllowed: false,
      transportNeeded: false,
      canCompanyCollect: false,
      images: [],
    },
  });

  // Create Space Posts
  const spacePost1 = await prisma.post.create({
    data: {
      type: PostType.SPACE,
      status: PostStatus.AVAILABLE,
      userId: cityProfile1.userId,
      cityId: cityProfile1.id,
      title: 'Storage Space Available',
      description: 'Large storage space available for construction materials. Secure and accessible location. 24/7 access.',
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

  const spacePost2 = await prisma.post.create({
    data: {
      type: PostType.SPACE,
      status: PostStatus.RESERVED,
      userId: cityProfile1.userId,
      cityId: cityProfile1.id,
      title: 'Workshop Space - Temporary',
      description: 'Temporary workshop space for construction projects. Includes basic utilities.',
      subtype: 'workshop',
      quantity: 150,
      unit: 'm²',
      price: 75000, // €750.00/month
      latitude: 38.7280,
      longitude: -9.1480,
      address: 'City Workshop Facility, Lisboa',
      rentalDuration: 'monthly',
      availabilityDate: new Date('2024-11-15'),
      pickupAllowed: false,
      transportNeeded: false,
      canCompanyCollect: false,
      images: [],
    },
  });

  console.log('💼 Creating projects...');

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      homeownerId: homeowner1.id,
      title: 'Kitchen Renovation',
      description: 'Complete kitchen renovation including new cabinets, countertops, and appliances. Looking for experienced contractors.',
      projectType: 'kitchen_renovation',
      size: 25.5,
      materials: 'Modern cabinets, quartz countertops, stainless steel appliances',
      budgetMin: 15000,
      budgetMax: 25000,
      predictedCost: 20000,
      status: 'OPEN',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      homeownerId: homeowner2.id,
      title: 'Bathroom Remodel',
      description: 'Full bathroom renovation with new tiles, fixtures, and plumbing. Need professional installation.',
      projectType: 'bathroom_renovation',
      size: 12.0,
      materials: 'Ceramic tiles, modern fixtures, walk-in shower',
      budgetMin: 8000,
      budgetMax: 12000,
      predictedCost: 10000,
      status: 'IN_PROGRESS',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      homeownerId: homeowner1.id,
      title: 'Living Room Renovation',
      description: 'Living room renovation with new flooring, paint, and lighting. Medium-sized project.',
      projectType: 'living_room_renovation',
      size: 35.0,
      materials: 'Hardwood flooring, modern lighting, fresh paint',
      budgetMin: 10000,
      budgetMax: 15000,
      predictedCost: 12500,
      status: 'OPEN',
    },
  });

  const project4 = await prisma.project.create({
    data: {
      homeownerId: homeowner3.id,
      title: 'Complete Home Renovation',
      description: 'Full home renovation project. Multiple phases. Looking for reliable contractor.',
      projectType: 'full_renovation',
      size: 120.0,
      materials: 'Various materials needed',
      budgetMin: 50000,
      budgetMax: 80000,
      predictedCost: 65000,
      status: 'COMPLETED',
    },
  });

  console.log('💰 Creating offers...');

  // Create Offers - PENDING
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
      postId: materialPost1.id,
      userId: companyProfile2.userId,
      companyId: companyProfile2.id,
      amount: 48000, // €480.00
      message: 'Interested in the roof tiles. Can offer slightly more and collect immediately.',
      status: OfferStatus.PENDING,
    },
  });

  const offer3 = await prisma.offer.create({
    data: {
      postId: materialPost4.id,
      userId: homeowner2.id,
      amount: 25000, // €250.00
      message: 'Interested in the wooden planks for my renovation project.',
      status: OfferStatus.PENDING,
    },
  });

  const offer4 = await prisma.offer.create({
    data: {
      postId: materialPost6.id,
      userId: companyProfile1.userId,
      companyId: companyProfile1.id,
      amount: 140000, // €1400.00
      message: 'Need sand and gravel for ongoing project. Can arrange transport.',
      status: OfferStatus.PENDING,
    },
  });

  // Create Offers - ACCEPTED (these become orders)
  const offer5 = await prisma.offer.create({
    data: {
      postId: materialPost2.id,
      userId: companyProfile1.userId,
      companyId: companyProfile1.id,
      amount: 110000, // €1100.00
      message: 'Interested in the reclaimed flooring. Perfect for our current project.',
      status: OfferStatus.ACCEPTED,
    },
  });

  const offer6 = await prisma.offer.create({
    data: {
      postId: spacePost2.id,
      userId: companyProfile2.userId,
      companyId: companyProfile2.id,
      amount: 70000, // €700.00
      message: 'Need workshop space for temporary project. Can start immediately.',
      status: OfferStatus.ACCEPTED,
    },
  });

  const offer7 = await prisma.offer.create({
    data: {
      postId: materialPost6.id,
      userId: companyProfile3.userId,
      companyId: companyProfile3.id,
      amount: 145000, // €1450.00
      message: 'Interested in bulk sand and gravel. Can arrange pickup.',
      status: OfferStatus.ACCEPTED,
    },
  });

  // Create Offers - REJECTED
  const offer8 = await prisma.offer.create({
    data: {
      postId: materialPost3.id,
      userId: companyProfile2.userId,
      companyId: companyProfile2.id,
      amount: 60000, // €600.00
      message: 'Interested in bathroom tiles but offer is below asking price.',
      status: OfferStatus.REJECTED,
    },
  });

  // Update post status for accepted offers
  await prisma.post.update({
    where: { id: materialPost2.id },
    data: { status: PostStatus.RESERVED },
  });

  await prisma.post.update({
    where: { id: spacePost2.id },
    data: { status: PostStatus.RESERVED },
  });

  console.log('📝 Creating audit logs...');

  // Create Audit Logs
  const posts = [materialPost1, materialPost2, materialPost3, materialPost4, materialPost5, materialPost6, materialPost7, materialPost8, servicePost1, servicePost2, servicePost3, spacePost1, spacePost2];
  
  for (const post of posts) {
    await prisma.postAuditLog.create({
      data: {
        postId: post.id,
        userId: post.userId,
        action: 'CREATE',
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`\n📊 Created:`);
  console.log(`- 7 Users (3 Homeowners, 3 Companies, 1 City)`);
  console.log(`- 3 Company Profiles (2 verified, 1 unverified)`);
  console.log(`- 1 City Profile (verified)`);
  console.log(`- 13 Posts:`);
  console.log(`  • 8 Material posts (6 available, 2 reserved)`);
  console.log(`  • 3 Service posts (all available)`);
  console.log(`  • 2 Space posts (1 available, 1 reserved)`);
  console.log(`- 8 Offers:`);
  console.log(`  • 4 PENDING offers`);
  console.log(`  • 3 ACCEPTED offers (these appear as orders)`);
  console.log(`  • 1 REJECTED offer`);
  console.log(`- 4 Projects:`);
  console.log(`  • 2 OPEN projects`);
  console.log(`  • 1 IN_PROGRESS project`);
  console.log(`  • 1 COMPLETED project`);
  console.log(`- 13 Audit logs`);
  
  console.log(`\n🔐 Test credentials (all use password: password123):`);
  console.log(`Homeowner: homeowner1@example.com`);
  console.log(`Homeowner: homeowner2@example.com`);
  console.log(`Homeowner: homeowner3@example.com`);
  console.log(`Company: company1@example.com (BuildCorp - verified)`);
  console.log(`Company: company2@example.com (RenovatePro - verified)`);
  console.log(`Company: company3@example.com (EcoBuild - unverified)`);
  console.log(`City: city1@example.com (Lisbon Municipality - verified)`);
  
  console.log(`\n🗺️ All posts are located in Lisbon area for map display`);
  console.log(`📈 Dashboard data will show:`);
  console.log(`  • Homeowners: posts created, active projects, pending offers, completed projects`);
  console.log(`  • Companies: active offers, total posts, pending offers, orders in progress`);
  console.log(`  • City: material posts, materials recycled, hazardous materials, active pickups`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
