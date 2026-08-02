const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage configurations for different file types
const createCloudinaryStorage = (folder, resourceType = 'auto') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `portfolio/${folder}`,
      resource_type: resourceType,
      allowed_formats: resourceType === 'raw' 
        ? ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: resourceType === 'image' ? [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ] : undefined
    }
  });
};

// Storage for images (profile, projects, general images)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { type } = req.body;
    let folder = 'portfolio/images';
    
    switch (type) {
      case 'profile':
        folder = 'portfolio/profile';
        break;
      case 'project':
        folder = 'portfolio/projects';
        break;
      case 'icon':
      case 'image':
      default:
        folder = 'portfolio/images';
    }
    
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    };
  }
});

// Storage for documents (PDFs, Word docs, etc.)
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/documents',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt']
  }
});

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Helper function to extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;
  
  // Extract public_id from Cloudinary URL
  // Format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/filename.ext
  const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
  if (matches && matches[1]) {
    return matches[1];
  }
  
  // Alternative format without version
  const matches2 = url.match(/\/upload\/(.+)\.\w+$/);
  if (matches2 && matches2[1]) {
    return matches2[1];
  }
  
  return null;
};

module.exports = {
  cloudinary,
  imageStorage,
  documentStorage,
  createCloudinaryStorage,
  deleteFromCloudinary,
  extractPublicId
};
