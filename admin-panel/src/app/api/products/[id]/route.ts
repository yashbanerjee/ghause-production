import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { getCorsHeaders } from '@/lib/cors';

type Context = {
  params: Promise<{ id: string }>
};

export async function GET(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;
  const corsHeaders = getCorsHeaders(req.headers.get('origin'), {
    credentials: true,
  });

  if (!id) {
    return NextResponse.json({ error: 'Missing product ID' }, { status: 400, headers: corsHeaders });
  }

  const isAdmin = req.headers.get('authorization') !== null;

  try {
    const product = await prisma.product.findUnique({
      where: isAdmin ? { id } : { id, isActive: true },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(product, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error: any) {
    console.error('API Error detailed:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;
  const corsHeaders = getCorsHeaders(req.headers.get('origin'), {
    credentials: true,
  });

  if (!id) {
    return NextResponse.json({ error: 'Missing product ID' }, { status: 400, headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const updateData: any = {};

    // Extract text fields
    const fields = [
      'nameEn',
      'nameAr',
      'nameFr',
      'descriptionEn',
      'descriptionAr',
      'descriptionFr',
      'categoryId',
      'isFeatured',
    ];
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === 'isFeatured') {
          updateData[field] = value === 'true';
        } else if (
          (field === 'nameFr' || field === 'descriptionFr') &&
          typeof value === 'string' &&
          !value.trim()
        ) {
          updateData[field] = null;
        } else {
          updateData[field] = value as string;
        }
      }
    });

    // Handle image upload
    const imageFile = formData.get('image') as File | null;
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      updateData.image = await uploadToS3(imageFile, 'products/images');
    }

    // Handle catalog uploads (append to existing)
    const catalogs = formData.getAll('catalogs');
    if (catalogs.length > 0) {
      const newCatalogUrls: string[] = [];
      for (const item of catalogs) {
        if (item instanceof File && item.size > 0) {
          const url = await uploadToS3(item, 'products/catalogs');
          newCatalogUrls.push(url);
        }
      }
      
      if (newCatalogUrls.length > 0) {
        const currentProduct = await prisma.product.findUnique({ where: { id }, select: { catalogs: true } });
        updateData.catalogs = [...(currentProduct?.catalogs || []), ...newCatalogUrls];
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true }
    });

    return NextResponse.json(product, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Product Update Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to update product',
        details: error.code || undefined 
      }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;
  const corsHeaders = getCorsHeaders(req.headers.get('origin'), {
    credentials: true,
  });

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted' }, {
      headers: corsHeaders,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete product' }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get('origin'), { credentials: true }),
  });
}
