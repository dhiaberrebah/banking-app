import pkg from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { v2: cloudinary } = pkg;

// Debug environment variables
console.log('Cloudinary ENV Variables:');
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
