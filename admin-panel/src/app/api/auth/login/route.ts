import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const admin = await prisma.admin.findUnique({ 
        where: { email } 
    });

    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    const token = jwt.sign(
      { id: admin.id, email: admin.email }, 
      secret, 
      { expiresIn: '24h' }
    );

    return NextResponse.json({ 
        token, 
        admin: { id: admin.id, email: admin.email } 
    });

  } catch (err: any) {
    console.error('Login Error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
