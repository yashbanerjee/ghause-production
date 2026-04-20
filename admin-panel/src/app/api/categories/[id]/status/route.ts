import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

type Context = {
  params: Promise<{ id: string }>
};

export async function PATCH(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  try {
    const { isActive } = await req.json();

    const category = await prisma.category.update({
      where: { id },
      data: { isActive: !!isActive }
    });

    return NextResponse.json(category, {
      headers: {
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });
  } catch (error: any) {
    console.error('Category Status Update Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update status' }, { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
    },
  });
}
