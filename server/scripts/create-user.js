const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function createUser() {
  const email = 'admin@ghaus.com';
  const password = '123456';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: { email, password: hashedPassword },
    });
    console.log('Admin user created successfully in TARGET DB:');
    console.log('ID:', admin.id);
    console.log('Email:', admin.email);
  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
