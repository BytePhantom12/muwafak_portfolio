const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: options.resourceType || 'image',
      folder: options.folder,
      public_id: options.publicId
    };

    if (options.transformation) {
      uploadOptions.transformation = options.transformation;
    }

    console.log('Cloudinary upload options:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
      resource_type: uploadOptions.resource_type,
      folder: uploadOptions.folder,
      public_id: uploadOptions.public_id,
      transformation: uploadOptions.transformation
    });

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    ).end(buffer);
  });
};

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

const extractPublicId = (url) => {
  if (!url) {
    return null;
  }

  const matches = url.match(/\/v\d+\/(.+)\.[^/]+$/);
  if (matches && matches[1]) {
    return matches[1];
  }

  const fallbackMatches = url.match(/\/upload\/(.+)\.[^/]+$/);
  if (fallbackMatches && fallbackMatches[1]) {
    return fallbackMatches[1];
  }

  return null;
};

module.exports = {
  cloudinary,
  uploadBuffer,
  deleteFromCloudinary,
  extractPublicId
};
