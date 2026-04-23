import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { getCorsHeaders } from '@/lib/cors';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');
  const isAdmin = req.headers.get('authorization') !== null;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const where = {
      ...(categoryId ? { categoryId } : {}),
      ...(searchParams.has('isFeatured') ? { isFeatured } : {}),
      ...(isAdmin ? {} : { isActive: true }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: isAdmin ? skip : undefined,
        take: isAdmin ? limit : undefined,
      }),
      prisma.product.count({ where })
    ]);

    const corsHeaders = getCorsHeaders(req.headers.get('origin'));

    if (!isAdmin && !searchParams.has('page')) {
      return NextResponse.json(products, {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          ...corsHeaders
        }
      });
    }

    return NextResponse.json({
      data: products,
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
        ...corsHeaders
      }
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { 
        status: 500,
        headers: getCorsHeaders(req.headers.get('origin'))
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  try {
    const formData = await req.formData();
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const nameFrRaw = formData.get('nameFr') as string | null;
    const nameFr = nameFrRaw && nameFrRaw.trim() ? nameFrRaw.trim() : null;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const descriptionFrRaw = formData.get('descriptionFr') as string | null;
    const descriptionFr =
      descriptionFrRaw && descriptionFrRaw.trim() ? descriptionFrRaw.trim() : null;
    const categoryId = formData.get('categoryId') as string;
    
    // Handle main image
    const imageFile = formData.get('image') as File | null;
    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToS3(imageFile, 'products/images');
    }

    // Handle multiple catalogs
    const catalogUrls: string[] = [];
    const catalogs = formData.getAll('catalogs');
    for (const item of catalogs) {
      if (item instanceof File && item.size > 0) {
        const url = await uploadToS3(item, 'products/catalogs');
        catalogUrls.push(url);
      }
    }

    const productData: any = {
      nameEn,
      nameAr,
      nameFr,
      descriptionEn,
      descriptionAr,
      descriptionFr,
      categoryId,
      image: imageUrl || null,
      catalogs: catalogUrls,
      isActive: true,
      isFeatured: formData.get('isFeatured') === 'true'
    };

    const product = await prisma.product.create({
      data: productData,
      include: { category: true }
    });

    return NextResponse.json(product, {
      status: 201,
      headers: corsHeaders
    });
  } catch (error: any) {
    console.error('Product Creation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' }, 
      { 
        status: 500,
        headers: corsHeaders
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
