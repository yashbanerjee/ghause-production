import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendEnquiryEmail } from '@/lib/mail';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // PRODUCT, QUICK, CONTACT
  const status = searchParams.get('status');
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const where = {
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { subject: { contains: search, mode: 'insensitive' as const } },
          { comment: { contains: search, mode: 'insensitive' as const } },
          { productName: { contains: search, mode: 'insensitive' as const } },
        ]
      } : {})
    };

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.enquiry.count({ where })
    ]);

    return NextResponse.json({
      data: enquiries,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' }, 
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
        }
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, type, productName, subject, company, address, country } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required.' }, 
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
          }
        }
      );
    }

    // 1. Save to Database
    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        comment: message,
        type: type || 'PRODUCT',
        productName: productName || null,
        subject: subject || null,
        company: company || null,
        address: address || null,
        country: country || null,
        status: 'unread'
      }
    });

    // 2. Send Email Notification
    try {
      await sendEnquiryEmail({
        name,
        email,
        phone,
        message,
        type: type || 'PRODUCT',
        productName: productName || null
      });
      console.log(`[Enquiry API] Email notification sent successfully to info@ghausglobal.com `);
    } catch (emailError) {
      console.error(`[Enquiry API] Failed to send email notification:`, emailError);
      // We don't return 500 here because the enquiry was saved successfully in the DB.
    }

    return NextResponse.json(enquiry, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process enquiry' }, 
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
    },
  });
}
