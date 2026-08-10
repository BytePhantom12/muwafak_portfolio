#!/usr/bin/env node
'use strict';

require('dotenv').config();
const { cloudinary } = require('../config/cloudinary');

const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing Cloudinary variables: ${missing.join(', ')}`);
  process.exit(1);
}

const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

(async () => {
  let publicId;
  try {
    const result = await cloudinary.uploader.upload(testImage, {
      resource_type: 'image',
      folder: 'portfolio/diagnostics',
    });
    publicId = result.public_id;
    console.log('Cloudinary direct SDK upload succeeded.');
  } catch (error) {
    console.error(`Cloudinary direct SDK upload failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      console.log('Cloudinary diagnostic asset deleted.');
    }
  }
})();
