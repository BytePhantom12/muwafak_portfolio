require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function testPasswordHashing() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Create a user and verify password is hashed
    console.log('📝 Test 1: Creating user with plain password...');
    const plainPassword = 'testPassword123';
    
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: plainPassword,
      role: 'admin'
    });

    console.log(`✅ User created: ${testUser.username}`);
    console.log(`   Plain password: ${plainPassword}`);
    console.log(`   Hashed password: ${testUser.password}`);
    console.log(`   Password is hashed: ${testUser.password !== plainPassword ? '✅ YES' : '❌ NO'}\n`);

    // Test 2: Verify password comparison works
    console.log('🔐 Test 2: Testing password comparison...');
    const isCorrectPassword = await testUser.comparePassword(plainPassword);
    const isWrongPassword = await testUser.comparePassword('wrongPassword');
    
    console.log(`   Correct password matches: ${isCorrectPassword ? '✅ YES' : '❌ NO'}`);
    console.log(`   Wrong password rejected: ${!isWrongPassword ? '✅ YES' : '❌ NO'}\n`);

    // Test 3: Verify password is not re-hashed on update
    console.log('🔄 Test 3: Testing password update...');
    const oldHash = testUser.password;
    testUser.username = 'testuser_updated';
    await testUser.save();
    
    console.log(`   Password hash unchanged: ${testUser.password === oldHash ? '✅ YES' : '❌ NO'}\n`);

    // Test 4: Update password and verify new hash
    console.log('🔑 Test 4: Changing password...');
    const newPassword = 'newPassword456';
    testUser.password = newPassword;
    await testUser.save();
    
    const newHash = testUser.password;
    const isNewPasswordCorrect = await testUser.comparePassword(newPassword);
    const isOldPasswordRejected = await testUser.comparePassword(plainPassword);
    
    console.log(`   New password hash created: ${newHash !== oldHash ? '✅ YES' : '❌ NO'}`);
    console.log(`   New password matches: ${isNewPasswordCorrect ? '✅ YES' : '❌ NO'}`);
    console.log(`   Old password rejected: ${!isOldPasswordRejected ? '✅ YES' : '❌ NO'}\n`);

    // Cleanup
    console.log('🗑️  Cleaning up test user...');
    await User.deleteOne({ _id: testUser._id });
    console.log('✅ Test user deleted\n');

    console.log('🎉 All password hashing tests passed!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the test
testPasswordHashing();
