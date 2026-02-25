
import mongoose from 'mongoose';
import CompanyDetails from './src/models/CompanyDetails';
import fs from 'fs';

// Try to load .env manually
try {
    const envFile = fs.readFileSync('.env', 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) process.env[key.trim()] = value.trim();
    });
} catch (e) { }

async function checkCompany() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shop');
        console.log('Connected to MongoDB');

        const details = await CompanyDetails.findOne({});
        if (details) {
            console.log(`Company Name: ${details.name}`);
            console.log(`Logo URL: ${details.logoUrl}`);
        } else {
            console.log('No company details found.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCompany();
