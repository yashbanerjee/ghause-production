const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({ token, admin: { id: admin.id, email: admin.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Tool to create default admin (for development/initial setup)
exports.createDefaultAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await prisma.admin.create({
            data: { email, password: hashedPassword },
        });
        res.status(201).json({ message: 'Admin created', admin: { id: admin.id, email: admin.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create admin' });
    }
};
