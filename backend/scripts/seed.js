#!/usr/bin/env node

/**
 * scripts/seed.js
 * ─────────────────────────────────────────────────
 * Seeds MongoDB with the canonical default portfolio.
 *
 * Usage:  npm run seed          (from backend/)
 *    or:  node scripts/seed.js
 *
 * • Preserves every document in the users collection.
 * • Deletes ALL Portfolio documents.
 * • Inserts one Portfolio document built from shared/seedData.json.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Portfolio = require('../models/Portfolio');
const seedData = require('../shared/seedData');

async function seed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;

  if (!mongoUri) {
    console.error('❌  MONGODB_URI is not set. Add it to your .env file.');
    process.exit(1);
  }

  try {
    console.log('🔗  Connecting to MongoDB…');
    await mongoose.connect(mongoUri);
    console.log('✅  Connected to MongoDB');

    // ── Preserve users (no action needed — we only touch Portfolio) ──

    // ── Delete all existing Portfolio documents ──
    const deleteResult = await Portfolio.deleteMany({});
    console.log(`🗑️   Deleted ${deleteResult.deletedCount} existing Portfolio document(s)`);

    // ── Insert one Portfolio document from shared seed data ──
    const portfolio = await Portfolio.create(seedData);
    console.log('✅  Seed complete – 1 Portfolio document inserted');
    console.log(`    _id: ${portfolio._id}`);

    await mongoose.disconnect();
    console.log('🔌  Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌  Seed failed:', error.message);
    console.error(error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

seed();
