require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@ghaus.com';
  const password = '123456';
  
  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  if (admin) {
    console.log('Admin already exists:', admin.email);
    // Let's update the password just to be sure it's '123456' hashed correctly
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword }
    });
    console.log('Admin password updated to default.');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword
      }
    });
    console.log('Admin created with default credentials.');
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
