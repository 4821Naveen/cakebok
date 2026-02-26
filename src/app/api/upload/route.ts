
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

        // Determine storage directory: 
        // In local development: public/uploads
        // In production Docker: /app/data/uploads
        const isProd = process.env.NODE_ENV === 'production';
        const storageDir = isProd
            ? path.join(process.cwd(), 'data', 'uploads')
            : path.join(process.cwd(), 'public', 'uploads');

        // Ensure the directory exists
        await import('fs').then(fs => fs.promises.mkdir(storageDir, { recursive: true }));
        const filePath = path.join(storageDir, filename);

        console.log(`[Upload API] Mode: ${process.env.NODE_ENV}`);
        console.log(`[Upload API] Target path: ${filePath}`);

        await writeFile(filePath, buffer);

        // Return the API Serving URL
        const fileUrl = `/api/images/${filename}`;

        return NextResponse.json({ url: fileUrl });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
