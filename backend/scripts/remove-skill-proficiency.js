require('dotenv').config();

const mongoose = require('mongoose');
const { connectDB } = require('../config/database');
const Portfolio = require('../models/Portfolio');

async function removeSkillProficiency() {
  try {
    await connectDB();

    const result = await Portfolio.collection.updateMany(
      { 'skills.items.level': { $exists: true } },
      { $unset: { 'skills.$[].items.$[].level': '' } }
    );
    const remainingCount = await Portfolio.collection.countDocuments({
      'skills.items.level': { $exists: true },
    });

    console.log(`Skill proficiency removed from ${result.modifiedCount} portfolio document(s).`);
    console.log(`Portfolio documents still containing proficiency: ${remainingCount}.`);
  } catch (error) {
    console.error(`Skill proficiency migration failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

removeSkillProficiency();
