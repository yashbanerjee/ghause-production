const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

try {
    console.log('Generating Prisma Client...');
    execSync('npx prisma generate', { 
        cwd: __dirname, 
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });
    console.log('Prisma Client generated successfully.');
} catch (error) {
    console.error('Failed to generate Prisma Client:', error.message);
    process.exit(1);
}
