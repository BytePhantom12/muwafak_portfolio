require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');

const MONGODB_URI = process.env.MONGODB_URI;

async function verifyData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Verify Users
    console.log('👥 Checking Users...');
    const users = await User.find({});
    console.log(`   Total users: ${users.length}`);
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.email}) - Role: ${user.role}`);
        console.log(`     Password hashed: ${user.password.startsWith('$2a$') ? '✅' : '❌'}`);
      });
    }
    console.log();

    // Verify Portfolio
    console.log('📁 Checking Portfolio Data...');
    const portfolios = await Portfolio.find({});
    console.log(`   Total portfolios: ${portfolios.length}`);
    
    if (portfolios.length > 0) {
      const portfolio = portfolios[0];
      console.log(`\n   Profile:`);
      console.log(`   - Name: ${portfolio.profile.name}`);
      console.log(`   - Title: ${portfolio.profile.title}`);
      console.log(`   - Email: ${portfolio.profile.email}`);
      
      console.log(`\n   About:`);
      console.log(`   - Description length: ${portfolio.about.description.length} chars`);
      console.log(`   - Highlights: ${portfolio.about.highlights.length}`);
      
      console.log(`\n   Skills:`);
      console.log(`   - Categories: ${portfolio.skills.length}`);
      portfolio.skills.forEach(skill => {
        console.log(`     • ${skill.category}: ${skill.items.length} items`);
      });
      
      console.log(`\n   Tech Stack:`);
      console.log(`   - Technologies: ${portfolio.techStack.length}`);
      portfolio.techStack.slice(0, 5).forEach(tech => {
        console.log(`     • ${tech.name} (${tech.category})`);
      });
      if (portfolio.techStack.length > 5) {
        console.log(`     ... and ${portfolio.techStack.length - 5} more`);
      }
      
      console.log(`\n   Education:`);
      console.log(`   - Entries: ${portfolio.education.length}`);
      portfolio.education.forEach(edu => {
        console.log(`     • ${edu.degree} - ${edu.institution}`);
      });
      
      console.log(`\n   Experience:`);
      console.log(`   - Positions: ${portfolio.experience.length}`);
      portfolio.experience.forEach(exp => {
        console.log(`     • ${exp.position} at ${exp.company} ${exp.current ? '(Current)' : ''}`);
      });
      
      console.log(`\n   Projects:`);
      console.log(`   - Total: ${portfolio.projects.length}`);
      portfolio.projects.forEach(project => {
        console.log(`     • ${project.title} ${project.featured ? '⭐' : ''}`);
        console.log(`       Technologies: ${project.technologies.join(', ')}`);
      });
      
      console.log(`\n   Contact:`);
      console.log(`   - Email: ${portfolio.contact.email}`);
      console.log(`   - Phone: ${portfolio.contact.phone || 'N/A'}`);
      console.log(`   - Social Links:`);
      if (portfolio.contact.social) {
        Object.entries(portfolio.contact.social).forEach(([platform, url]) => {
          if (url) console.log(`     • ${platform}: ${url}`);
        });
      }
    }

    console.log('\n✅ Data verification complete!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Portfolios: ${portfolios.length}`);
    if (portfolios.length > 0) {
      const p = portfolios[0];
      console.log(`   Projects: ${p.projects.length}`);
      console.log(`   Skills: ${p.skills.length} categories`);
      console.log(`   Experience: ${p.experience.length} positions`);
      console.log(`   Education: ${p.education.length} entries`);
      console.log(`   Tech Stack: ${p.techStack.length} technologies`);
    }

  } catch (error) {
    console.error('❌ Error verifying data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

verifyData();
