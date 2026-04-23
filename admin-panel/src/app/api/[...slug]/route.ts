import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';

type Context = {
    params: Promise<{ slug: string[] }>
};

// Enhanced catch-all handler for specific item lookups (details)
const handle = async (req: NextRequest, resolvedParams: { slug: string[] }) => {
    const slug = resolvedParams.slug;
    const isAdmin = req.headers.get('authorization') !== null;

    // Handlers for specific items are now moved to dedicated routes:
    // - /api/categories/[id]
    // - /api/products/[id]

    return NextResponse.json({
        message: "API Route Not Found",
        slug: slug.join('/')
    }, {
        status: 404,
        headers: getCorsHeaders(req.headers.get('origin')),
    });
};

export async function GET(req: NextRequest, context: Context) {
    const resolvedParams = await context.params;
    return handle(req, resolvedParams);
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get('origin')),
  });
}
