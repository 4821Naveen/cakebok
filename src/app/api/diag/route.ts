
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const cwd = process.cwd();
        const dataDir = path.join('/app', 'data', 'uploads');
        const devDir = path.join(cwd, 'public', 'uploads');

        const checkDir = (dir: string) => {
            const exists = fs.existsSync(dir);
            return {
                path: dir,
                exists,
                files: exists ? fs.readdirSync(dir) : [],
                stats: exists ? fs.statSync(dir) : null
            };
        };

        return NextResponse.json({
            cwd,
            nodeEnv: process.env.NODE_ENV,
            isProd: process.env.NODE_ENV === 'production',
            dataDir: checkDir(dataDir),
            devDir: checkDir(devDir)
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
