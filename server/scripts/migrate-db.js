const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function migrate() {
  const sourceUrl = process.env.OLD_DATABASE_URL;
  const targetUrl = process.env.DATABASE_URL;

  if (!sourceUrl || !targetUrl) {
    console.error('Missing OLD_DATABASE_URL or DATABASE_URL in .env');
    process.exit(1);
  }

  const sourcePrisma = new PrismaClient({
    datasources: { db: { url: sourceUrl } },
  });

  const targetPrisma = new PrismaClient({
    datasources: { db: { url: targetUrl } },
  });

  try {
    console.log('--- Database Migration Started ---');

    // 1. Migrate Admin Users
    const admins = await sourcePrisma.admin.findMany();
    console.log(`Found ${admins.length} Admins.`);
    for (const admin of admins) {
      await targetPrisma.admin.upsert({
        where: { email: admin.email },
        update: admin,
        create: admin,
      });
    }
    console.log('Admins migrated.');

    // 2. Migrate Categories
    const categories = await sourcePrisma.category.findMany();
    console.log(`Found ${categories.length} Categories.`);
    for (const cat of categories) {
      await targetPrisma.category.upsert({
        where: { id: cat.id },
        update: cat,
        create: cat,
      });
    }
    console.log('Categories migrated.');

    // 3. Migrate Products
    const products = await sourcePrisma.product.findMany();
    console.log(`Found ${products.length} Products.`);
    for (const prod of products) {
      await targetPrisma.product.upsert({
        where: { id: prod.id },
        update: prod,
        create: prod,
      });
    }
    console.log('Products migrated.');

    // 4. Migrate Enquiries
    const enquiries = await sourcePrisma.enquiry.findMany();
    console.log(`Found ${enquiries.length} Enquiries.`);
    for (const enq of enquiries) {
      await targetPrisma.enquiry.upsert({
        where: { id: enq.id },
        update: enq,
        create: enq,
      });
    }
    console.log('Enquiries migrated.');

    console.log('--- Migration Completed Successfully ---');
    
    // Verification
    const [sAdmins, sCats, sProds, sEnqs] = await Promise.all([
      sourcePrisma.admin.count(),
      sourcePrisma.category.count(),
      sourcePrisma.product.count(),
      sourcePrisma.enquiry.count(),
    ]);

    const [tAdmins, tCats, tProds, tEnqs] = await Promise.all([
      targetPrisma.admin.count(),
      targetPrisma.category.count(),
      targetPrisma.product.count(),
      targetPrisma.enquiry.count(),
    ]);

    console.log('--- Verification Report ---');
    console.log(`Admins: Source=${sAdmins}, Target=${tAdmins}`);
    console.log(`Categories: Source=${sCats}, Target=${tCats}`);
    console.log(`Products: Source=${sProds}, Target=${tProds}`);
    console.log(`Enquiries: Source=${sEnqs}, Target=${tEnqs}`);

  } catch (error) {
    console.error('Migration Failed:', error);
  } finally {
    await sourcePrisma.$disconnect();
    await targetPrisma.$disconnect();
  }
}

migrate();
