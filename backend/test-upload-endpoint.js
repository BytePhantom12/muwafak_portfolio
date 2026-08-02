const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Upload Endpoint with Cloudinary\n');

async function testUpload() {
  try {
    // First, login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123456'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // Create a test image file (1x1 pixel PNG)
    console.log('2️⃣ Creating test image...');
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    const testImagePath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Test image created\n');

    // Upload the test image
    console.log('3️⃣ Uploading to Cloudinary...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath));
    formData.append('type', 'image');

    const uploadResponse = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(uploadData.message || 'Upload failed');
    }

    console.log('✅ Upload successful!\n');
    console.log('📊 Upload Response:');
    console.log(JSON.stringify(uploadData, null, 2));
    console.log('\n---\n');

    // Verify it's a Cloudinary URL
    if (uploadData.data.url.includes('cloudinary.com')) {
      console.log('✅ File uploaded to Cloudinary!');
      console.log('🔗 URL:', uploadData.data.url);
      console.log('\n✨ Test passed! Cloudinary integration is working correctly.');
    } else {
      console.log('⚠️  Warning: URL does not appear to be from Cloudinary');
      console.log('URL:', uploadData.data.url);
    }

    // Clean up test file
    fs.unlinkSync(testImagePath);
    console.log('\n🧹 Cleaned up test file');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Backend server is running (npm start)');
    console.error('  2. MongoDB is connected');
    console.error('  3. Cloudinary credentials are correct in .env');
    process.exit(1);
  }
}

testUpload();
