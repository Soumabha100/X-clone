import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// This ensures environment variables are loaded.
dotenv.config();

// Configure Cloudinary with the correct environment variable names.
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, // Corrected from CLOUDINARY_API_KEY
    api_secret: process.env.API_SECRET // Corrected from CLOUDINARY_API_SECRET
});

// Configure multer-storage-cloudinary.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'x-clone-tweets',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export default storage;
