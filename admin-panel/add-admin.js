const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Initialize Prisma with the URL from env to be sure
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const email = 'admin@ghaus.com';
  const password = '123456';

  try {
    console.log('Attempting to create admin:', email);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.admin.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
      },
    });

    console.log('SUCCESS: Admin created/updated.');
    console.log('Admin ID:', admin.id);
  } catch (e) {
    console.error('FAILURE: Could not create admin.');
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
