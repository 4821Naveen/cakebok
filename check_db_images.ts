
import mongoose from 'mongoose';
import Product from './src/models/Product';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

async function checkImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB');

        const imageToFind = '1771770338034-WhatsApp-Image-2026-02-20-at-12.15.32-PM.jpeg';
        const products = await Product.find({ images: { $regex: imageToFind } });

        if (products.length === 0) {
            console.log('No products found with this image.');
        } else {
            products.forEach(p => {
                console.log(`Product Found: ${p.name} (ID: ${p._id})`);
                console.log(`Images: ${JSON.stringify(p.images)}`);
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkImages();
