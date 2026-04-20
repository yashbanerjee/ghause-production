import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

type Context = {
  params: Promise<{ id: string }>
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing enquiry ID' }, { status: 400, headers: corsHeaders });
  }

  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id }
    });

    if (!enquiry) {
      return NextResponse.json({ message: 'Enquiry not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(enquiry, { headers: corsHeaders });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing enquiry ID' }, { status: 400, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Missing status in body' }, { status: 400, headers: corsHeaders });
    }

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedEnquiry, { headers: corsHeaders });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
