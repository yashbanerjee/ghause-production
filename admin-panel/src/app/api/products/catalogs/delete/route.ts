import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function DELETE(req: NextRequest) {
  try {
    const { productId, fileUrl } = await req.json();

    if (!productId || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing productId or fileUrl' },
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

    // Fetch the product first to get current catalogs
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { catalogs: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
          }
        }
      );
    }

    // Remove the specific fileUrl from the catalogs array
    const updatedCatalogs = product.catalogs.filter(url => url !== fileUrl);

    // Update the product record
    await prisma.product.update({
      where: { id: productId },
      data: { catalogs: updatedCatalogs }
    });

    return NextResponse.json({ message: 'Catalog removed successfully' }, {
      headers: {
        "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
      }
    });

  } catch (error: any) {
    console.error('Catalog Delete Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete catalog' },
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
