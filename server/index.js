const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');

const prisma = require('./lib/prisma');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const enquiriesRoute = require('./routes/enquiries');
const enquiryController = require('./controllers/enquiryController');

const app = express();
const PORT = process.env.PORT || 5000;

const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(
    cors({
        origin: [
            "https://www.ghausglobal.com",
            "https://ghaus-website-kpmse7k3v-mohd-saad-bhatis-projects.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);
app.options("/(.*)", cors());
app.use(express.json());

const authMiddleware = require('./middleware/auth');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiriesRoute);

// Public Inquiry Route
app.post('/api/send-inquiry', enquiryController.createEnquiry);

const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@ghaus.com';
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: adminEmail }
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            await prisma.admin.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword
                }
            });
            console.log('✅ Default admin created: admin@ghaus.com / 123456');
        } else {
            console.log('ℹ️ Admin already exists');
        }
    } catch (err) {
        console.error('❌ Admin seeding failed:', err);
    }
};

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`Server running on http://localhost:${PORT}`);
        await seedAdmin();
    });
}

module.exports = app;
