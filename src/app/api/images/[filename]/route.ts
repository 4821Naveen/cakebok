
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Determine storage directory: 
        // In local development: public/uploads
        // In production Docker: /app/data/uploads
        const isProd = process.env.NODE_ENV === 'production';
        const storageDir = isProd
            ? path.join('/app', 'data', 'uploads')
            : path.join(process.cwd(), 'public', 'uploads');

        const filePath = path.join(storageDir, filename);

        // Security: Prevent path traversal
        if (!filePath.startsWith(storageDir)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);

        // Get extension for MIME type
        const ext = path.extname(filename).toLowerCase();
        const mimeMap: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': mimeMap[ext] || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });

    } catch (error: any) {
        console.error('Image Serving Error:', error);
        return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 });
    }
}
