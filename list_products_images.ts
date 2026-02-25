
import mongoose from 'mongoose';
import Product from './src/models/Product';
//import dotenv from 'dotenv';
import fs from 'fs';

// Try to load .env manually if dotenv is not available
try {
    const envFile = fs.readFileSync('.env', 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) process.env[key.trim()] = value.trim();
    });
} catch (e) { }

async function listProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shop');
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Total Products: ${products.length}`);

        products.forEach(p => {
            console.log(`- ${p.name} | Images: ${p.images.join(', ')}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

listProducts();
