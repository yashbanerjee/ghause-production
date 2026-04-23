import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCorsHeaders } from '@/lib/cors';

export async function POST(req: NextRequest) {
  const cors = getCorsHeaders(req.headers.get('origin'));
  try {
    const { email, password } = await req.json();

    const admin = await prisma.admin.findUnique({ 
        where: { email } 
    });

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 400, headers: cors }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 400, headers: cors }
      );
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    const token = jwt.sign(
      { id: admin.id, email: admin.email }, 
      secret, 
      { expiresIn: '24h' }
    );

    return NextResponse.json(
      {
        token,
        admin: { id: admin.id, email: admin.email },
      },
      { headers: cors }
    );
  } catch (err: any) {
    console.error('Login Error:', err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500, headers: cors }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get('origin')),
  });
}
