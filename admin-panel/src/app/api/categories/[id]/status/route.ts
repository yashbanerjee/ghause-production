import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';

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
      headers: getCorsHeaders(req.headers.get('origin')),
    });
  } catch (error: any) {
    console.error('Category Status Update Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update status' }, { 
      status: 500,
      headers: getCorsHeaders(req.headers.get('origin')),
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get('origin')),
  });
}
