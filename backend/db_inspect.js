const mongoose = require('mongoose');
require('dotenv').config();
const Portfolio = require('./models/Portfolio');

async function run() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
  await mongoose.connect(mongoUri);
  const portfolio = await Portfolio.findOne();
  if (!portfolio) {
    console.log('No portfolio document found');
    process.exit(0);
  }
  console.log('Total projects in DB:', portfolio.projects.length);
  portfolio.projects.forEach((proj, idx) => {
    console.log(`\nProject ${idx + 1}:`);
    console.log(`  _id:`, proj._id ? proj._id.toString() : 'NONE');
    console.log(`  title:`, proj.title);
    console.log(`  image:`, JSON.stringify(proj.image));
  });
  mongoose.disconnect();
}
run();
