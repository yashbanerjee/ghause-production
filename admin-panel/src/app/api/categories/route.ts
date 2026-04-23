import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { getCorsHeaders } from '@/lib/cors';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const getAll = searchParams.get('all') === 'true';
  const isAdmin = req.headers.get('authorization') !== null; // Simple check for now
  
  const skip = (page - 1) * limit;

  try {
    const where = {
      ...(isAdmin ? {} : { isActive: true }),
      ...(search ? {
        OR: [
          { nameEn: { contains: search, mode: 'insensitive' as const } },
          { nameAr: { contains: search, mode: 'insensitive' as const } },
          { nameFr: { contains: search, mode: 'insensitive' as const } },
        ]
      } : {})
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: { 
          products: {
            where: isAdmin ? undefined : { isActive: true },
            orderBy: [
              { index: 'asc' },
              { createdAt: 'desc' }
            ]
          }
        },
        orderBy: { createdAt: 'asc' },
        skip: (isAdmin && !getAll) ? skip : undefined,
        take: (isAdmin && !getAll) ? limit : undefined,
      }),
      prisma.category.count({ where })
    ]);

    if ((!isAdmin && !searchParams.has('page')) || getAll) {
      return NextResponse.json(categories, {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          ...getCorsHeaders(req.headers.get('origin'))
        }
      });
    }

    return NextResponse.json({
      data: categories,
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
        ...getCorsHeaders(req.headers.get('origin'))
      }
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { 
        status: 500,
        headers: getCorsHeaders(req.headers.get('origin'))
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const nameFrRaw = formData.get('nameFr') as string | null;
    const nameFr = nameFrRaw?.trim() ? nameFrRaw.trim() : null;
    const homeDescriptionEn = formData.get('homeDescriptionEn') as string;
    const homeDescriptionAr = formData.get('homeDescriptionAr') as string;
    const homeDescriptionFrRaw = formData.get('homeDescriptionFr') as string | null;
    const homeDescriptionFr = homeDescriptionFrRaw?.trim()
      ? homeDescriptionFrRaw.trim()
      : null;
    const productPageDescriptionEn = formData.get('productPageDescriptionEn') as string;
    const productPageDescriptionAr = formData.get('productPageDescriptionAr') as string;
    const productPageDescriptionFrRaw = formData.get('productPageDescriptionFr') as string | null;
    const productPageDescriptionFr = productPageDescriptionFrRaw?.trim()
      ? productPageDescriptionFrRaw.trim()
      : null;
    
    const iconFile = formData.get('icon') as File | null;
    const imageFile = formData.get('image') as File | null;

    let iconUrl = '';
    let imageUrl = '';

    if (iconFile && iconFile.size > 0) {
      iconUrl = await uploadToS3(iconFile, 'categories/icons');
    }

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToS3(imageFile, 'categories/banners');
    }

    const category = await prisma.category.create({
      data: {
        nameEn,
        nameAr,
        nameFr,
        homeDescriptionEn,
        homeDescriptionAr,
        homeDescriptionFr,
        productPageDescriptionEn,
        productPageDescriptionAr,
        productPageDescriptionFr,
        icon: iconUrl || null,
        image: imageUrl || null,
        isActive: true
      }
    });

    return NextResponse.json(category, {
      status: 201,
      headers: getCorsHeaders(req.headers.get('origin'))
    });
  } catch (error: any) {
    console.error('Category Creation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' }, 
      { 
        status: 500,
        headers: getCorsHeaders(req.headers.get('origin'))
      }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get('origin')),
  });
}
