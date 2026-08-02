const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/auth');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { 
  cloudinary,
  deleteFromCloudinary,
  extractPublicId 
} = require('../config/cloudinary');

// File filter for validation - accepts both images and documents
const fileFilter = (req, file, cb) => {
  // Document mime types
  const documentMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
    'text/plain',
    'text/rtf'
  ];
  
  // Check if it's an image or document
  if (file.mimetype.startsWith('image/') || documentMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and documents (PDF, Word, ODT, RTF, TXT) are allowed'), false);
  }
};

// Create a unified storage that handles both images and documents
const unifiedStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { type } = req.body;
    
    // Determine if it's a document based on mime type
    const isDocument = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
      'application/rtf',
      'text/plain',
      'text/rtf'
    ].includes(file.mimetype);
    
    // Determine folder based on type
    let folder = 'portfolio/images';
    if (type === 'document' || type === 'cv') {
      folder = 'portfolio/documents';
    } else if (type === 'profile') {
      folder = 'portfolio/profile';
    } else if (type === 'project') {
      folder = 'portfolio/projects';
    }
    
    return {
      folder: folder,
      resource_type: isDocument ? 'raw' : 'image',
      allowed_formats: isDocument 
        ? ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: !isDocument ? [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ] : undefined
    };
  }
});

// Configure multer with unified storage
const upload = multer({
  storage: unifiedStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST /api/upload - Upload single file (protected)
router.post('/', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully to Cloudinary',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: req.file.path, // Cloudinary URL
        publicId: req.file.filename,
        cloudinary: true
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// DELETE /api/upload/:type/:filename - Delete file (protected)
router.delete('/:type/:filename', auth, async (req, res) => {
  try {
    const { type, filename } = req.params;
    
    // Determine resource type for Cloudinary
    const resourceType = (type === 'document' || type === 'cv') ? 'raw' : 'image';
    
    // Extract public_id from filename or construct it
    let publicId = filename;
    
    // If filename contains the full path, extract just the public_id
    if (filename.includes('/')) {
      publicId = filename;
    } else {
      // Construct the public_id based on folder structure
      let folder = 'images';
      switch (type) {
        case 'project':
          folder = 'projects';
          break;
        case 'profile':
          folder = 'profile';
          break;
        case 'document':
        case 'cv':
          folder = 'documents';
          break;
      }
      publicId = `portfolio/${folder}/${filename}`;
    }
    
    // Remove file extension from public_id if present
    publicId = publicId.replace(/\.[^/.]+$/, '');
    
    const result = await deleteFromCloudinary(publicId, resourceType);
    
    if (result.result === 'ok' || result.result === 'not found') {
      res.json({
        success: true,
        message: 'File deleted successfully from Cloudinary'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found on Cloudinary'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
});

// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: error.message || 'Upload error'
  });
});

module.exports = router;