import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

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
        headers: {
            "Access-Control-Allow-Origin": "https://www.ghausglobal.com",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Cache-Control, Pragma, Expires",
        }
    });
};

export async function GET(req: NextRequest, context: Context) {
    const resolvedParams = await context.params;
    return handle(req, resolvedParams);
}
