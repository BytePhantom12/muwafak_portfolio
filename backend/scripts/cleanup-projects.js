/**
 * cleanup-projects.js
 * 
 * Repairs corrupted project data in the portfolio database.
 * 
 * The corruption: all 6 projects currently share the same title, description,
 * and image data because the frontend was mapping _id incorrectly, causing
 * every project to be overwritten with the same data on save.
 * 
 * What this script does:
 *   1. Connects to MongoDB.
 *   2. Reads the current portfolio document.
 *   3. Detects if corruption is present (all projects share same image public_id).
 *   4. Keeps the first project's uploaded image intact (Portfolio & Admin Dashboard).
 *   5. Restores projects 2–6 to their default seed data, clearing the shared image.
 *   6. Saves the repaired portfolio document.
 * 
 * Usage:
 *   node scripts/cleanup-projects.js
 */

'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const seedData = require('../shared/seedData');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI / MONGODB_URI is not set in .env');
  process.exit(1);
}

const defaultProjects = seedData.projects;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.\n');

  const portfolio = await Portfolio.findOne();
  if (!portfolio) {
    console.log('No portfolio document found. Nothing to clean up.');
    await mongoose.disconnect();
    return;
  }

  const projects = portfolio.projects;
  console.log(`Found ${projects.length} project(s) in portfolio.\n`);

  if (projects.length === 0) {
    console.log('No projects to clean up.');
    await mongoose.disconnect();
    return;
  }

  // -------------------------------------------------------------------
  // Detect corruption: are multiple projects sharing the same public_id?
  // -------------------------------------------------------------------
  const publicIds = projects
    .map(p => p.image?.public_id)
    .filter(Boolean);

  const uniquePublicIds = new Set(publicIds);
  const hasSharedImages = publicIds.length > 0 && uniquePublicIds.size < publicIds.length;

  if (!hasSharedImages) {
    console.log('No shared image corruption detected. Projects look healthy.');
    console.log('Project titles:');
    projects.forEach((p, i) => console.log(`  [${i + 1}] ${p.title} (${p._id})`));
    await mongoose.disconnect();
    return;
  }

  console.log('CORRUPTION DETECTED: Multiple projects share the same image public_id(s).');
  console.log('Shared public_ids:', [...uniquePublicIds].filter(id => publicIds.filter(x => x === id).length > 1));
  console.log('\nProceeding with repair...\n');

  // -------------------------------------------------------------------
  // Repair strategy:
  //   - Slot 0: Keep the uploaded image (this is Portfolio & Admin Dashboard).
  //   - Slots 1–5: Reset to default seed data, clear image field.
  // -------------------------------------------------------------------
  for (let i = 0; i < projects.length; i++) {
    const seedProject = defaultProjects[i] || defaultProjects[defaultProjects.length - 1];

    if (i === 0) {
      // Keep the real uploaded image but restore the title to seed data
      console.log(`[Project 1] Keeping uploaded image. Ensuring title is: "${seedProject.title}"`);
      projects[i].title = seedProject.title;
      projects[i].description = seedProject.description;
      projects[i].technologies = seedProject.technologies;
      projects[i].liveUrl = seedProject.liveUrl || '';
      projects[i].githubUrl = seedProject.githubUrl || '';
      projects[i].featured = seedProject.featured ?? false;
      // image is intentionally left as-is (the real uploaded one)
    } else {
      // Restore defaults and clear the shared image
      console.log(`[Project ${i + 1}] Restoring to seed defaults: "${seedProject.title}"`);
      projects[i].title = seedProject.title;
      projects[i].description = seedProject.description;
      projects[i].technologies = seedProject.technologies;
      projects[i].liveUrl = seedProject.liveUrl || '';
      projects[i].githubUrl = seedProject.githubUrl || '';
      projects[i].featured = seedProject.featured ?? false;
      projects[i].image = {
        secure_url: null,
        public_id: null,
        width: null,
        height: null,
        format: null,
      };
    }
  }

  // Mark the subdocuments as modified so Mongoose saves them
  portfolio.markModified('projects');
  await portfolio.save();

  console.log('\nRepair complete! Updated project list:');
  const updated = await Portfolio.findOne();
  updated.projects.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.title}`);
    console.log(`       _id: ${p._id}`);
    console.log(`       image: ${p.image?.public_id || '(none)'}`);
  });

  console.log('\nDone. Disconnecting.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Cleanup script failed:', err);
  mongoose.disconnect().finally(() => process.exit(1));
});
