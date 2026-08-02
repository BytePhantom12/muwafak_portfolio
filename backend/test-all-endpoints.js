/**
 * Comprehensive API Endpoint Testing Suite
 * Tests all CRUD operations for Portfolio Admin Panel
 * 
 * Run with: node test-all-endpoints.js
 */

const API_BASE = 'http://localhost:5000/api';
let authToken = '';
let testIds = {
  project: null,
  education: null,
  experience: null,
  skill: null,
  techStack: null,
  contactMessage: null
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logTest(name) {
  log(`\n→ Testing: ${name}`, 'blue');
}

function logSuccess(message) {
  log(`  ✓ ${message}`, 'green');
}

function logError(message) {
  log(`  ✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`  ⚠ ${message}`, 'yellow');
}

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (authToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    return { response, data };
  } catch (error) {
    return { error: error.message };
  }
}

// ============================================================================
// AUTHENTICATION TESTS
// ============================================================================

async function testAuthentication() {
  logSection('AUTHENTICATION TESTS');

  // Test 1: Login
  logTest('POST /api/auth/login');
  const { response: loginRes, data: loginData } = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123456'
    }),
    skipAuth: true
  });

  if (loginRes.ok && loginData.token) {
    authToken = loginData.token;
    logSuccess(`Login successful - Token received`);
    logSuccess(`User: ${loginData.user.username} (${loginData.user.role})`);
  } else {
    logError(`Login failed: ${loginData.message}`);
    process.exit(1);
  }

  // Test 2: Get current user
  logTest('GET /api/auth/me');
  const { response: meRes, data: meData } = await apiRequest('/auth/me');
  
  if (meRes.ok) {
    logSuccess(`Current user retrieved: ${meData.username}`);
  } else {
    logError(`Failed to get current user: ${meData.message}`);
  }
}

// ============================================================================
// PORTFOLIO TESTS
// ============================================================================

async function testPortfolio() {
  logSection('PORTFOLIO TESTS');

  // Test 1: Get portfolio
  logTest('GET /api/portfolio');
  const { response: getRes, data: getData } = await apiRequest('/portfolio', {
    skipAuth: true
  });

  if (getRes.ok) {
    logSuccess(`Portfolio retrieved successfully`);
    logSuccess(`Sections: profile, about, skills, projects, education, experience`);
  } else {
    logError(`Failed to get portfolio: ${getData.message}`);
  }

  // Test 2: Update entire portfolio
  logTest('PUT /api/portfolio');
  const { response: updateRes, data: updateData } = await apiRequest('/portfolio', {
    method: 'PUT',
    body: JSON.stringify({
      profile: {
        name: 'Test User',
        title: 'Full Stack Developer',
        bio: 'Test bio',
        email: 'test@example.com'
      }
    })
  });

  if (updateRes.ok) {
    logSuccess(`Portfolio updated successfully`);
  } else {
    logError(`Failed to update portfolio: ${updateData.message || updateData.error}`);
  }
}

// ============================================================================
// PROJECTS TESTS
// ============================================================================

async function testProjects() {
  logSection('PROJECTS CRUD TESTS');

  // Test 1: Add project
  logTest('PUT /api/portfolio/section/projects (ADD)');
  const newProject = {
    title: 'Test Project',
    description: 'This is a test project',
    image: '/images/test.png',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveUrl: 'https://test.com',
    githubUrl: 'https://github.com/test/test',
    featured: true
  };

  const { response: addRes, data: addData } = await apiRequest('/portfolio/section/projects', {
    method: 'PUT',
    body: JSON.stringify([newProject])
  });

  if (addRes.ok && addData.projects && addData.projects.length > 0) {
    testIds.project = addData.projects[0]._id;
    logSuccess(`Project added - ID: ${testIds.project}`);
  } else {
    logError(`Failed to add project: ${addData.message || addData.error}`);
  }

  // Test 2: Update project
  logTest('PUT /api/portfolio/section/projects (UPDATE)');
  const updatedProject = {
    ...newProject,
    _id: testIds.project,
    title: 'Updated Test Project',
    description: 'Updated description'
  };

  const { response: updateRes, data: updateData } = await apiRequest('/portfolio/section/projects', {
    method: 'PUT',
    body: JSON.stringify([updatedProject])
  });

  if (updateRes.ok) {
    logSuccess(`Project updated successfully`);
  } else {
    logError(`Failed to update project: ${updateData.message || updateData.error}`);
  }

  // Test 3: Delete project
  logTest('PUT /api/portfolio/section/projects (DELETE)');
  const { response: deleteRes, data: deleteData } = await apiRequest('/portfolio/section/projects', {
    method: 'PUT',
    body: JSON.stringify([])
  });

  if (deleteRes.ok) {
    logSuccess(`Project deleted successfully`);
  } else {
    logError(`Failed to delete project: ${deleteData.message || deleteData.error}`);
  }
}

// ============================================================================
// EDUCATION TESTS
// ============================================================================

async function testEducation() {
  logSection('EDUCATION CRUD TESTS');

  // Test 1: Add education
  logTest('PUT /api/portfolio/section/education (ADD)');
  const newEducation = {
    institution: 'Test University',
    degree: 'Bachelor of Science in Computer Science',
    field: '2019 - 2023',
    description: 'Test education description'
  };

  const { response: addRes, data: addData } = await apiRequest('/portfolio/section/education', {
    method: 'PUT',
    body: JSON.stringify([newEducation])
  });

  if (addRes.ok && addData.education && addData.education.length > 0) {
    testIds.education = addData.education[0]._id;
    logSuccess(`Education added - ID: ${testIds.education}`);
  } else {
    logError(`Failed to add education: ${addData.message || addData.error}`);
  }

  // Test 2: Update education
  logTest('PUT /api/portfolio/section/education (UPDATE)');
  const updatedEducation = {
    ...newEducation,
    _id: testIds.education,
    degree: 'Master of Science in Computer Science'
  };

  const { response: updateRes, data: updateData } = await apiRequest('/portfolio/section/education', {
    method: 'PUT',
    body: JSON.stringify([updatedEducation])
  });

  if (updateRes.ok) {
    logSuccess(`Education updated successfully`);
  } else {
    logError(`Failed to update education: ${updateData.message || updateData.error}`);
  }

  // Test 3: Delete education
  logTest('PUT /api/portfolio/section/education (DELETE)');
  const { response: deleteRes, data: deleteData } = await apiRequest('/portfolio/section/education', {
    method: 'PUT',
    body: JSON.stringify([])
  });

  if (deleteRes.ok) {
    logSuccess(`Education deleted successfully`);
  } else {
    logError(`Failed to delete education: ${deleteData.message || deleteData.error}`);
  }
}

// ============================================================================
// EXPERIENCE TESTS
// ============================================================================

async function testExperience() {
  logSection('EXPERIENCE CRUD TESTS');

  // Test 1: Add experience
  logTest('PUT /api/portfolio/section/experience (ADD)');
  const newExperience = {
    company: 'Test Company',
    position: 'Full Stack Developer',
    startDate: new Date('2022-01-01'),
    current: true,
    description: 'Test experience description',
    technologies: ['React', 'Node.js', 'MongoDB']
  };

  const { response: addRes, data: addData } = await apiRequest('/portfolio/section/experience', {
    method: 'PUT',
    body: JSON.stringify([newExperience])
  });

  if (addRes.ok && addData.experience && addData.experience.length > 0) {
    testIds.experience = addData.experience[0]._id;
    logSuccess(`Experience added - ID: ${testIds.experience}`);
  } else {
    logError(`Failed to add experience: ${addData.message || addData.error}`);
  }

  // Test 2: Update experience
  logTest('PUT /api/portfolio/section/experience (UPDATE)');
  const updatedExperience = {
    ...newExperience,
    _id: testIds.experience,
    position: 'Senior Full Stack Developer'
  };

  const { response: updateRes, data: updateData } = await apiRequest('/portfolio/section/experience', {
    method: 'PUT',
    body: JSON.stringify([updatedExperience])
  });

  if (updateRes.ok) {
    logSuccess(`Experience updated successfully`);
  } else {
    logError(`Failed to update experience: ${updateData.message || updateData.error}`);
  }

  // Test 3: Delete experience
  logTest('PUT /api/portfolio/section/experience (DELETE)');
  const { response: deleteRes, data: deleteData } = await apiRequest('/portfolio/section/experience', {
    method: 'PUT',
    body: JSON.stringify([])
  });

  if (deleteRes.ok) {
    logSuccess(`Experience deleted successfully`);
  } else {
    logError(`Failed to delete experience: ${deleteData.message || deleteData.error}`);
  }
}

// ============================================================================
// SKILLS TESTS
// ============================================================================

async function testSkills() {
  logSection('SKILLS CRUD TESTS');

  // Test 1: Add skills
  logTest('PUT /api/portfolio/section/skills (ADD)');
  const newSkills = [
    {
      category: 'Frontend',
      items: ['React', 'Vue', 'Angular']
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Python', 'Java']
    }
  ];

  const { response: addRes, data: addData } = await apiRequest('/portfolio/section/skills', {
    method: 'PUT',
    body: JSON.stringify(newSkills)
  });

  if (addRes.ok) {
    logSuccess(`Skills added successfully`);
    logSuccess(`Categories: ${newSkills.map(s => s.category).join(', ')}`);
  } else {
    logError(`Failed to add skills: ${addData.message || addData.error}`);
  }

  // Test 2: Update skills
  logTest('PUT /api/portfolio/section/skills (UPDATE)');
  const updatedSkills = [
    {
      category: 'Frontend',
      items: ['React', 'Vue', 'Angular', 'Svelte']
    }
  ];

  const { response: updateRes, data: updateData } = await apiRequest('/portfolio/section/skills', {
    method: 'PUT',
    body: JSON.stringify(updatedSkills)
  });

  if (updateRes.ok) {
    logSuccess(`Skills updated successfully`);
  } else {
    logError(`Failed to update skills: ${updateData.message || updateData.error}`);
  }

  // Test 3: Delete skills
  logTest('PUT /api/portfolio/section/skills (DELETE)');
  const { response: deleteRes, data: deleteData } = await apiRequest('/portfolio/section/skills', {
    method: 'PUT',
    body: JSON.stringify([])
  });

  if (deleteRes.ok) {
    logSuccess(`Skills deleted successfully`);
  } else {
    logError(`Failed to delete skills: ${deleteData.message || deleteData.error}`);
  }
}

// ============================================================================
// TECH STACK TESTS
// ============================================================================

async function testTechStack() {
  logSection('TECH STACK CRUD TESTS');

  // Test 1: Add tech stack
  logTest('PUT /api/portfolio/section/techStack (ADD)');
  const newTech = {
    name: 'React',
    icon: '/icons/react.png',
    category: 'Frontend'
  };

  const { response: addRes, data: addData } = await apiRequest('/portfolio/section/techStack', {
    method: 'PUT',
    body: JSON.stringify([newTech])
  });

  if (addRes.ok && addData.techStack && addData.techStack.length > 0) {
    testIds.techStack = addData.techStack[0]._id;
    logSuccess(`Tech stack added - ID: ${testIds.techStack}`);
  } else {
    logError(`Failed to add tech stack: ${addData.message || addData.error}`);
  }

  // Test 2: Update tech stack
  logTest('PUT /api/portfolio/section/techStack (UPDATE)');
  const updatedTech = {
    ...newTech,
    _id: testIds.techStack,
    name: 'React.js'
  };

  const { response: updateRes, data: updateData } = await apiRequest('/portfolio/section/techStack', {
    method: 'PUT',
    body: JSON.stringify([updatedTech])
  });

  if (updateRes.ok) {
    logSuccess(`Tech stack updated successfully`);
  } else {
    logError(`Failed to update tech stack: ${updateData.message || updateData.error}`);
  }

  // Test 3: Delete tech stack
  logTest('PUT /api/portfolio/section/techStack (DELETE)');
  const { response: deleteRes, data: deleteData } = await apiRequest('/portfolio/section/techStack', {
    method: 'PUT',
    body: JSON.stringify([])
  });

  if (deleteRes.ok) {
    logSuccess(`Tech stack deleted successfully`);
  } else {
    logError(`Failed to delete tech stack: ${deleteData.message || deleteData.error}`);
  }
}

// ============================================================================
// CONTACT FORM TESTS
// ============================================================================

async function testContactForm() {
  logSection('CONTACT FORM TESTS');

  // Test 1: Submit contact form (public)
  logTest('POST /api/contact (PUBLIC)');
  const contactData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message from the automated test suite.'
  };

  const { response: submitRes, data: submitData } = await apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
    skipAuth: true
  });

  if (submitRes.ok && submitData.success) {
    testIds.contactMessage = submitData.data.id;
    logSuccess(`Contact form submitted - ID: ${testIds.contactMessage}`);
  } else {
    logError(`Failed to submit contact form: ${submitData.message}`);
  }

  // Test 2: Get all messages (admin)
  logTest('GET /api/contact (ADMIN)');
  const { response: getRes, data: getData } = await apiRequest('/contact');

  if (getRes.ok && getData.success) {
    logSuccess(`Retrieved ${getData.data.length} messages`);
    logSuccess(`Unread count: ${getData.unreadCount}`);
  } else {
    logError(`Failed to get messages: ${getData.message}`);
  }

  // Test 3: Mark as read
  logTest('PATCH /api/contact/:id/read');
  const { response: readRes, data: readData } = await apiRequest(`/contact/${testIds.contactMessage}/read`, {
    method: 'PATCH',
    body: JSON.stringify({ read: true })
  });

  if (readRes.ok && readData.success) {
    logSuccess(`Message marked as read`);
  } else {
    logError(`Failed to mark as read: ${readData.message}`);
  }

  // Test 4: Add reply
  logTest('PATCH /api/contact/:id/reply');
  const { response: replyRes, data: replyData } = await apiRequest(`/contact/${testIds.contactMessage}/reply`, {
    method: 'PATCH',
    body: JSON.stringify({ replyMessage: 'Thank you for your message!' })
  });

  if (replyRes.ok && replyData.success) {
    logSuccess(`Reply added successfully`);
  } else {
    logError(`Failed to add reply: ${replyData.message}`);
  }

  // Test 5: Delete message
  logTest('DELETE /api/contact/:id');
  const { response: deleteRes, data: deleteData } = await apiRequest(`/contact/${testIds.contactMessage}`, {
    method: 'DELETE'
  });

  if (deleteRes.ok && deleteData.success) {
    logSuccess(`Message deleted successfully`);
  } else {
    logError(`Failed to delete message: ${deleteData.message}`);
  }
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

async function runAllTests() {
  log('\n🚀 Starting Comprehensive API Tests\n', 'cyan');
  log(`Testing API at: ${API_BASE}`, 'yellow');
  log(`Make sure the backend server is running!\n`, 'yellow');

  try {
    await testAuthentication();
    await testPortfolio();
    await testProjects();
    await testEducation();
    await testExperience();
    await testSkills();
    await testTechStack();
    await testContactForm();

    logSection('TEST SUMMARY');
    log('✓ All tests completed!', 'green');
    log('\nTest IDs generated:', 'cyan');
    console.log(JSON.stringify(testIds, null, 2));
    
  } catch (error) {
    logError(`\nTest suite failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runAllTests();
