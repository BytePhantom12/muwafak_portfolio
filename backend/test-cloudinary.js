const { cloudinary } = require('./config/cloudinary');
require('dotenv').config();

console.log('🔍 Testing Cloudinary Configuration\n');

console.log('Configuration:');
console.log('  Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('  API Key:', process.env.CLOUDINARY_API_KEY);
console.log('  API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set');
console.log('\n---\n');

// Test connection by fetching account details
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Response:', result);
    console.log('\n---\n');
    
    // Try to get usage stats (may not be available on all plans)
    return cloudinary.api.usage().catch(() => null);
  })
  .then(usage => {
    if (usage) {
      console.log('📊 Account Usage:');
      console.log('  Plan:', usage.plan || 'Free');
      console.log('  Storage:', {
        used: `${((usage.storage?.usage || 0) / 1024 / 1024).toFixed(2)} MB`,
        limit: usage.storage?.limit ? `${(usage.storage.limit / 1024 / 1024).toFixed(2)} MB` : 'Unlimited'
      });
      console.log('  Bandwidth:', {
        used: `${((usage.bandwidth?.usage || 0) / 1024 / 1024).toFixed(2)} MB`,
        limit: usage.bandwidth?.limit ? `${(usage.bandwidth.limit / 1024 / 1024).toFixed(2)} MB` : 'Unlimited'
      });
    } else {
      console.log('ℹ️  Usage stats not available (may require paid plan)');
    }
    
    console.log('\n✨ Cloudinary is ready to use!');
    console.log('\nYou can now:');
    console.log('  1. Run "node migrate-to-cloudinary.js" to migrate existing files');
    console.log('  2. Start your server and upload new files');
    console.log('  3. View your files at: https://console.cloudinary.com/app/c-438a2316f6dfeba15cbd7583d27b90');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed!');
    console.error('Error:', error.message || error);
    console.error('\nPlease check:');
    console.error('  1. Your .env file has correct Cloudinary credentials');
    console.error('  2. CLOUDINARY_CLOUD_NAME=dua4vifmt');
    console.error('  3. CLOUDINARY_API_KEY=346515697169613');
    console.error('  4. CLOUDINARY_API_SECRET=BgySUE0G_0EGp0xOXLDtSnM_pg0');
    process.exit(1);
  });
