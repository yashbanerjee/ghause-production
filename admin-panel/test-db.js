const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('--- DB Connection Test ---');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const categories = await prisma.category.findMany({ take: 1 });
    console.log('Success! Found categories:', categories.length);
  } catch (err) {
    console.error('DB Test Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
