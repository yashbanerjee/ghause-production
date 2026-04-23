import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';

export async function DELETE(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    const { productId, fileUrl } = await req.json();

    if (!productId || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing productId or fileUrl' },
        {
          status: 400,
          headers: getCorsHeaders(origin),
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
          headers: getCorsHeaders(origin),
        }
      );
    }

    // Remove the specific fileUrl from the catalogs array
    const updatedCatalogs = product.catalogs.filter((url: string) => url !== fileUrl);

    // Update the product record
    await prisma.product.update({
      where: { id: productId },
      data: { catalogs: updatedCatalogs }
    });

    return NextResponse.json({ message: 'Catalog removed successfully' }, {
      headers: getCorsHeaders(origin),
    });

  } catch (error: any) {
    console.error('Catalog Delete Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete catalog' },
      {
        status: 500,
        headers: getCorsHeaders(origin),
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
