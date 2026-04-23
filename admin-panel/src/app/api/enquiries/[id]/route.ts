import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';

type Context = {
  params: Promise<{ id: string }>
};

function enquiryHeaders(req: NextRequest) {
  return {
    ...getCorsHeaders(req.headers.get('origin')),
    'Cache-Control': 'no-store, max-age=0, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
}

export async function GET(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing enquiry ID' }, { status: 400, headers: enquiryHeaders(req) });
  }

  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id }
    });

    if (!enquiry) {
      return NextResponse.json({ message: 'Enquiry not found' }, { status: 404, headers: enquiryHeaders(req) });
    }

    return NextResponse.json(enquiry, { headers: enquiryHeaders(req) });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: enquiryHeaders(req) });
  }
}

export async function PATCH(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing enquiry ID' }, { status: 400, headers: enquiryHeaders(req) });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Missing status in body' }, { status: 400, headers: enquiryHeaders(req) });
    }

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedEnquiry, { headers: enquiryHeaders(req) });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: enquiryHeaders(req) });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: enquiryHeaders(req),
  });
}
