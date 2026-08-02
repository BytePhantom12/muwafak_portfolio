const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('MongoDB URI:', process.env.MONGODB_URI ? '✓ Found in .env' : '✗ NOT FOUND');
console.log('Attempting to connect...\n');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('📊 Connection Details:');
    console.log('   - Database:', mongoose.connection.name || 'default');
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    
    // Test if we can query the database
    return mongoose.connection.db.admin().listDatabases();
  })
  .then((result) => {
    console.log('\n📁 Available Databases:');
    result.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    console.log('\n✅ Database connection is working perfectly!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ FAILED! MongoDB connection error:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 Tip: Check your username and password in .env file');
    } else if (error.message.includes('network')) {
      console.error('\n💡 Tip: Check your internet connection or MongoDB Atlas IP whitelist');
    }
    
    process.exit(1);
  });
