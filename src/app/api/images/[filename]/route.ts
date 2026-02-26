
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename: rawFilename } = await params;
        const filename = decodeURIComponent(rawFilename);

        // Standardized storage path detection
        const isProd = process.env.NODE_ENV === 'production';

        // Define potential storage locations (absolute and relative)
        const possibleDirs = [
            path.join(process.cwd(), 'data', 'uploads'),
            path.join('/app', 'data', 'uploads'),
            path.join(process.cwd(), 'public', 'uploads'),
        ];

        let filePath = '';
        let found = false;

        for (const dir of possibleDirs) {
            const checkPath = path.join(dir, filename);
            if (fs.existsSync(checkPath)) {
                filePath = checkPath;
                found = true;
                break;
            }
        }

        if (!found) {
            console.error(`[Image API] File not found: ${filename} in any of: ${possibleDirs.join(', ')}`);
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
