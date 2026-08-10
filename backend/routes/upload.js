const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadBuffer, deleteFromCloudinary, extractPublicId } = require('../config/cloudinary');

const storage = multer.memoryStorage();
const IMAGE_TYPES = new Map([
  ['jpg', ['image/jpeg']], ['jpeg', ['image/jpeg']], ['png', ['image/png']],
  ['gif', ['image/gif']], ['webp', ['image/webp']], ['svg', ['image/svg+xml']]
]);
const DOCUMENT_TYPES = new Map([
  ['pdf', ['application/pdf']], ['doc', ['application/msword']],
  ['docx', ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']],
  ['odt', ['application/vnd.oasis.opendocument.text']],
  ['rtf', ['application/rtf', 'text/rtf']], ['txt', ['text/plain']]
]);

/**
 * @openapi
 * /api/upload:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload a file to Cloudinary
 *     description: Uploads an image or supported document as multipart/form-data.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image or document file. Supported image types include jpg, jpeg, png, gif, webp, svg. Supported documents include pdf, doc, docx, odt, rtf, txt.
 *               type:
 *                 type: string
 *                 example: project
 *                 description: Optional upload folder hint such as profile, project, document, cv, skill, or icon.
 *     responses:
 *       "200":
 *         description: File uploaded successfully
 *       "400":
 *         description: No file uploaded or invalid file type
 *       "401":
 *         description: No token or invalid token
 *       "500":
 *         description: Upload failed
 */
const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split('.').pop()?.toLowerCase();
  const allowedMimes = IMAGE_TYPES.get(extension) || DOCUMENT_TYPES.get(extension);
  if (allowedMimes?.includes(file.mimetype)) return cb(null, true);

  cb(new Error('Only images (jpg, jpeg, png, gif, webp, svg) and documents (pdf, doc, docx, odt, rtf, txt) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const getUploadOptions = (req, file) => {
  const type = req.body.type || 'image';
  const isDocument = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
    'text/plain',
    'text/rtf'
  ].includes(file.mimetype);

  let folder = 'portfolio/images';
  if (type === 'profile') {
    folder = 'portfolio/profile';
  } else if (type === 'project') {
    folder = 'portfolio/projects';
  } else if (type === 'document' || type === 'cv') {
    folder = 'portfolio/documents';
  } else if (type === 'skill' || type === 'skills' || type === 'icon') {
    folder = 'portfolio/skills';
  }

  const rawName = file.originalname.replace(/\.[^/.]+$/, '');
  const sanitizedFileName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');

  return {
    folder,
    resourceType: isDocument ? 'raw' : 'image',
    publicId: `${Date.now()}-${sanitizedFileName}`,
    transformation: isDocument ? undefined : [
      { width: 2000, height: 2000, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  };
};

router.post('/', auth, async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload.single('file')(req, res, (error) => error ? reject(error) : resolve());
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const options = getUploadOptions(req, req.file);
    const uploadResult = await uploadBuffer(req.file.buffer, options);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: uploadResult.public_id,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: uploadResult.secure_url,
        secure_url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        cloudinary: true
      }
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    const isClientError = error instanceof multer.MulterError || error.message.startsWith('Only images');
    res.status(isClientError ? 400 : 500).json({
      success: false,
      message: error.code === 'LIMIT_FILE_SIZE' ? 'The file must be 10MB or smaller' : error.message,
      error: isClientError ? 'Invalid upload' : 'The media provider rejected the upload'
    });
  }
});

/**
 * @openapi
 * /api/upload/{type}/{filename}:
 *   delete:
 *     tags:
 *       - Upload
 *     summary: Delete a file from Cloudinary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Upload type such as profile, project, document, or cv.
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Stored filename or public ID segment.
 *     responses:
 *       "200":
 *         description: File deleted successfully from Cloudinary
 *       "401":
 *         description: No token or invalid token
 *       "404":
 *         description: File not found on Cloudinary
 *       "500":
 *         description: Delete failed
 */
router.delete('/:type/:filename', auth, async (req, res) => {
  try {
    const { type, filename } = req.params;
    const resourceType = (type === 'document' || type === 'cv') ? 'raw' : 'image';

    let publicId = filename;
    if (!filename.includes('/')) {
      let folder = 'images';
      if (type === 'project') {
        folder = 'projects';
      } else if (type === 'profile') {
        folder = 'profile';
      } else if (type === 'document' || type === 'cv') {
        folder = 'documents';
      } else if (type === 'skill' || type === 'skills' || type === 'icon') {
        folder = 'skills';
      }

      publicId = `portfolio/${folder}/${filename}`;
    }

    const extractedPublicId = extractPublicId(publicId) || publicId;
    const result = await deleteFromCloudinary(extractedPublicId.replace(/\.[^/.]+$/, ''), resourceType);

    if (result.result === 'ok' || result.result === 'not found') {
      return res.json({
        success: true,
        message: 'File deleted successfully from Cloudinary'
      });
    }

    return res.status(404).json({
      success: false,
      message: 'File not found on Cloudinary'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
});

// Canonical deletion API. The public ID is sent in JSON so folder separators
// are preserved and never reconstructed from a delivery URL.
router.delete('/', auth, async (req, res) => {
  try {
    const { public_id: publicId, resource_type: resourceType = 'image' } = req.body;
    if (typeof publicId !== 'string' || !/^portfolio\/[a-z0-9/_-]+$/i.test(publicId)) {
      return res.status(400).json({ success: false, message: 'A valid portfolio public_id is required' });
    }
    if (!['image', 'raw'].includes(resourceType)) {
      return res.status(400).json({ success: false, message: 'Invalid resource_type' });
    }

    const result = await deleteFromCloudinary(publicId, resourceType);
    res.json({ success: true, result: result.result });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(502).json({ success: false, message: 'Media deletion failed' });
  }
});

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
