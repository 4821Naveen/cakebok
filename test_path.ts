
import fs from 'fs';
import path from 'path';

async function testUpload() {
    const filename = `test-upload-${Date.now()}.txt`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(uploadDir, filename);

    console.log(`CWD: ${process.cwd()}`);
    console.log(`Target Dir: ${uploadDir}`);

    try {
        if (!fs.existsSync(uploadDir)) {
            console.log('Creating directory...');
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(filePath, 'test content');
        console.log(`File written successfully: ${filePath}`);

        if (fs.existsSync(filePath)) {
            console.log('Verification: File exists on disk.');
        } else {
            console.log('Verification failed: File not found after write!');
        }
    } catch (e) {
        console.error('Error during test upload:', e);
    }
}

testUpload();
