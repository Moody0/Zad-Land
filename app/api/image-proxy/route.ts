import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    imageUrl = imageUrl.trim();

    // Prevent recursive proxy loops or invalid relative URLs
    if (imageUrl.startsWith('/') || imageUrl.includes('/api/image-proxy')) {
        return new NextResponse('Invalid image URL', { status: 400 });
    }

    try {
        const parsedUrl = new URL(imageUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return new NextResponse('Invalid protocol', { status: 400 });
        }

        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
            return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable');

        return new NextResponse(buffer, { headers });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse('Failed to load remote image', { status: 502 });
    }
}
