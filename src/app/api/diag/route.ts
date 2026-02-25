
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const cwd = process.cwd();
        const uploadDir = path.join(cwd, 'public/uploads');

        let files: string[] = [];
        let dirExists = false;
        let stats = null;

        if (fs.existsSync(uploadDir)) {
            dirExists = true;
            files = fs.readdirSync(uploadDir);
            stats = fs.statSync(uploadDir);
        }

        const publicDir = path.join(cwd, 'public');
        const publicFiles = fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : [];

        return NextResponse.json({
            cwd,
            uploadDir,
            dirExists,
            stats: stats ? {
                mode: stats.mode,
                uid: stats.uid,
                gid: stats.gid
            } : null,
            files,
            publicFiles
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
