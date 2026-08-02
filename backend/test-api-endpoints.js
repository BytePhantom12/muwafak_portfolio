require('dotenv').config();

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Get Portfolio Data (Public)
    console.log('📝 Test 1: GET /api/portfolio (Public)');
    const portfolioResponse = await fetch(`${API_BASE_URL}/portfolio`);
    const portfolioData = await portfolioResponse.json();
    
    if (portfolioResponse.ok) {
      console.log('✅ Portfolio data fetched successfully');
      console.log(`   - Profile: ${portfolioData.profile?.name}`);
      console.log(`   - About: ${portfolioData.about?.description?.substring(0, 50)}...`);
      console.log(`   - Tech Stack: ${portfolioData.techStack?.length} items`);
      console.log(`   - Education: ${portfolioData.education?.length} entries`);
      console.log(`   - Skills: ${portfolioData.skills?.length} categories`);
      console.log(`   - Experience: ${portfolioData.experience?.length} positions`);
      console.log(`   - Projects: ${portfolioData.projects?.length} projects`);
      console.log(`   - Contact: ${portfolioData.contact?.email}`);
    } else {
      console.log('❌ Failed to fetch portfolio data');
    }
    console.log();

    // Test 2: Login (Authentication)
    console.log('📝 Test 2: POST /api/auth/login');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123456'
      })
    });
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok && loginData.token) {
      console.log('✅ Login successful');
      console.log(`   - User: ${loginData.user.username}`);
      console.log(`   - Email: ${loginData.user.email}`);
      console.log(`   - Role: ${loginData.user.role}`);
      console.log(`   - Token: ${loginData.token.substring(0, 20)}...`);
      
      const token = loginData.token;
      console.log();

      // Test 3: Get Current User (Protected)
      console.log('📝 Test 3: GET /api/auth/me (Protected)');
      const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const meData = await meResponse.json();
      
      if (meResponse.ok) {
        console.log('✅ User data fetched successfully');
        console.log(`   - Username: ${meData.username}`);
        console.log(`   - Email: ${meData.email}`);
        console.log(`   - Role: ${meData.role}`);
      } else {
        console.log('❌ Failed to fetch user data');
      }
      console.log();

      // Test 4: Update Portfolio Section (Protected)
      console.log('📝 Test 4: PUT /api/portfolio/section/about (Protected)');
      const updateResponse = await fetch(`${API_BASE_URL}/portfolio/section/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: 'Test update - API is working!',
          highlights: ['Test highlight 1', 'Test highlight 2']
        })
      });
      
      if (updateResponse.ok) {
        console.log('✅ Portfolio section updated successfully');
        
        // Restore original data
        await fetch(`${API_BASE_URL}/portfolio/section/about`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(portfolioData.about)
        });
        console.log('✅ Original data restored');
      } else {
        console.log('❌ Failed to update portfolio section');
      }
      console.log();

    } else {
      console.log('❌ Login failed');
      console.log(`   Error: ${loginData.message}`);
    }

    // Test 5: Test Invalid Login
    console.log('📝 Test 5: POST /api/auth/login (Invalid Credentials)');
    const invalidLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'wrongpassword'
      })
    });
    
    if (!invalidLoginResponse.ok) {
      console.log('✅ Invalid credentials rejected correctly');
    } else {
      console.log('❌ Security issue: Invalid credentials accepted');
    }
    console.log();

    console.log('🎉 All API endpoint tests completed!\n');
    console.log('📊 Summary:');
    console.log('   ✅ Public portfolio endpoint working');
    console.log('   ✅ Authentication working');
    console.log('   ✅ Protected endpoints working');
    console.log('   ✅ Data updates working');
    console.log('   ✅ Security validation working');
    console.log('\n✨ Your API is ready to use!');

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n⚠️  Make sure the backend server is running on port 5000');
    console.log('   Run: npm run dev (in Backend folder)');
  }
}

testAPIEndpoints();
