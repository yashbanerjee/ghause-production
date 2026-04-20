import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';

type Context = {
  params: Promise<{ id: string }>
};

export async function GET(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;
  const isAdmin = req.headers.get('authorization') !== null;

  try {
    const category = await prisma.category.findUnique({
      where: isAdmin ? { id } : { id, isActive: true },
      include: { 
        products: isAdmin ? true : { where: { isActive: true } } 
      }
    });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { 
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
        }
      });
    }

    return NextResponse.json(category, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  try {
    const formData = await req.formData();
    const updateData: any = {};

    // Extract text fields
    const fields = [
      'nameEn', 'nameAr', 
      'homeDescriptionEn', 'homeDescriptionAr', 
      'productPageDescriptionEn', 'productPageDescriptionAr'
    ];

    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        updateData[field] = value as string;
      }
    });

    // Handle file uploads
    const iconFile = formData.get('icon') as File | null;
    const imageFile = formData.get('image') as File | null;

    if (iconFile && iconFile.size > 0) {
      updateData.icon = await uploadToS3(iconFile, 'categories/icons');
    }

    if (imageFile && imageFile.size > 0) {
      updateData.image = await uploadToS3(imageFile, 'categories/banners');
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(category, {
      headers: {
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });
  } catch (error: any) {
    console.error('Category Update Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const resolvedParams = await context.params;
  const id = resolvedParams?.id;

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: 'Category deleted' }, {
      headers: {
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete category' }, { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
    },
  });
}
