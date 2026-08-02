require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');

const MONGODB_URI = process.env.MONGODB_URI;

// Sample data
const sampleUser = {
  username: 'admin',
  email: 'admin@portfolio.com',
  password: 'admin123456',
  role: 'admin'
};

const samplePortfolio = {
  profile: {
    name: 'Muhib Nabil',
    title: 'Full Stack Developer',
    bio: 'Passionate full-stack developer with expertise in modern web technologies. I build scalable and user-friendly applications.',
    email: 'muhib@example.com',
    phone: '+1234567890',
    location: 'New York, USA',
    profileImage: null, // Will be uploaded via admin panel
    resume: null // Will be uploaded via admin panel
  },
  
  about: {
    description: 'I am a dedicated full-stack developer with 3+ years of experience in building web applications. I specialize in React, Node.js, and MongoDB, creating efficient and scalable solutions.',
    highlights: [
      '3+ years of professional experience',
      'Expert in MERN stack development',
      'Strong problem-solving skills',
      'Passionate about clean code and best practices'
    ]
  },
  
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Framer Motion']
    },
    {
      category: 'Backend',
      items: ['Python', 'Django', 'Node.js', 'REST API']
    },
    {
      category: 'Tools & Cloud',
      items: ['Git', 'VS Code', 'Figma', 'PostgreSQL', 'Vercel']
    }
  ],
  
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: new Date('2017-09-01'),
      endDate: new Date('2021-06-30'),
      description: 'Focused on software engineering, algorithms, and web development.',
      gpa: '3.8/4.0'
    },
    {
      institution: 'Tech Academy',
      degree: 'Full Stack Web Development Bootcamp',
      field: 'Web Development',
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-06-30'),
      description: 'Intensive program covering MERN stack, RESTful APIs, and modern development practices.'
    }
  ],
  
  experience: [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Full Stack Developer',
      startDate: new Date('2022-06-01'),
      current: true,
      description: 'Leading development of enterprise web applications using React and Node.js. Mentoring junior developers and implementing best practices.',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker']
    },
    {
      company: 'StartUp Innovations',
      position: 'Full Stack Developer',
      startDate: new Date('2021-07-01'),
      endDate: new Date('2022-05-31'),
      current: false,
      description: 'Developed and maintained multiple client projects. Built RESTful APIs and responsive user interfaces.',
      technologies: ['React', 'Express.js', 'PostgreSQL', 'Redux']
    }
  ],
  
  projects: [
    {
      title: 'CraftHub - Artisan Marketplace',
      description: 'A full-featured e-commerce platform connecting artisans with customers. Features include user authentication, product management, shopping cart, and payment integration.',
      image: 'crafthub.png',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
      liveUrl: 'https://crafthub-demo.com',
      githubUrl: 'https://github.com/muhib/crafthub',
      featured: true
    },
    {
      title: 'ProEx - Project Management Tool',
      description: 'Collaborative project management application with real-time updates, task tracking, and team communication features.',
      image: 'proex.png',
      technologies: ['React', 'Express.js', 'Socket.io', 'PostgreSQL', 'Redux'],
      liveUrl: 'https://proex-demo.com',
      githubUrl: 'https://github.com/muhib/proex',
      featured: true
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio website with admin dashboard for content management. Built with modern technologies and best practices.',
      image: 'muhib-portfolio.png',
      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Vite'],
      liveUrl: 'https://muhib-portfolio.com',
      githubUrl: 'https://github.com/muhib/portfolio',
      featured: false
    }
  ],
  
  contact: {
    email: 'muhib@example.com',
    phone: '+1234567890',
    social: {
      linkedin: 'https://linkedin.com/in/muhibnabil',
      github: 'https://github.com/muhibnabil',
      twitter: 'https://twitter.com/muhibnabil',
      website: 'https://muhib-portfolio.com'
    }
  }
};

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Portfolio.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create admin user
    console.log('👤 Creating admin user...');
    const user = await User.create(sampleUser);
    console.log(`✅ Admin user created: ${user.username} (${user.email})`);
    console.log(`   Password: ${sampleUser.password}`);

    // Create portfolio data
    console.log('📁 Creating portfolio data...');
    const portfolio = await Portfolio.create(samplePortfolio);
    console.log('✅ Portfolio data created');
    console.log(`   Profile: ${portfolio.profile.name}`);
    console.log(`   Projects: ${portfolio.projects.length}`);
    console.log(`   Skills: ${portfolio.skills.length} categories`);
    console.log(`   Experience: ${portfolio.experience.length} positions`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log(`   Username: ${sampleUser.username}`);
    console.log(`   Email: ${sampleUser.email}`);
    console.log(`   Password: ${sampleUser.password}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
