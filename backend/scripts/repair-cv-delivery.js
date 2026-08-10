require('dotenv').config();

const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary');
const { connectDB } = require('../config/database');
const Portfolio = require('../models/Portfolio');

const getRawPublicId = (url) => {
  const parsedUrl = new URL(url);
  const match = parsedUrl.pathname.match(/\/raw\/upload\/v\d+\/(.+)$/);
  return match?.[1] || null;
};

async function repairCvDelivery() {
  try {
    await connectDB();
    const portfolio = await Portfolio.findOne();
    const resumeUrl = portfolio?.profile?.resume;
    const currentPublicId = resumeUrl && getRawPublicId(resumeUrl);

    if (!currentPublicId || !/\.(pdf|doc|docx|odt|rtf|txt)$/i.test(currentPublicId)) {
      console.log('The current CV delivery ID does not need repair.');
      return;
    }

    const repairedPublicId = currentPublicId.replace(/\.(pdf|doc|docx|odt|rtf|txt)$/i, '');
    const result = await cloudinary.uploader.rename(currentPublicId, repairedPublicId, {
      resource_type: 'raw',
      overwrite: true,
    });

    portfolio.profile.resume = result.secure_url;
    portfolio.markModified('profile.resume');
    await portfolio.save();
    console.log('CV delivery asset and MongoDB URL repaired successfully.');
  } catch (error) {
    console.error(`CV delivery repair failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

repairCvDelivery();
