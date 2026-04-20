require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@ghaus.com';
  const password = '123456';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Using upsert to avoid duplicate errors if it runs twice
    const admin = await prisma.admin.upsert({
      where: { email },
      update: {
        password: hashedPassword,
      },
      create: {
        email,
        password: hashedPassword,
      },
    });

    console.log('Admin user created/updated successfully:');
    console.log('ID:', admin.id);
    console.log('Email:', admin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
