const fs = require('fs');
const path = require('path');
const { cloudinary } = require('./config/cloudinary');
const Portfolio = require('./models/Portfolio');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Starting migration to Cloudinary...\n');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB\n');
    migrateFiles();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

async function uploadToCloudinary(filePath, folder, resourceType = 'image') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `portfolio/${folder}`,
      resource_type: resourceType,
      transformation: resourceType === 'image' ? [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ] : undefined
    });
    
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
    return null;
  }
}

async function migrateFiles() {
  const uploadsDir = path.join(__dirname, 'uploads');
  const urlMapping = {};
  
  // Check if uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    console.log('⚠️  No uploads directory found. Nothing to migrate.');
    await mongoose.connection.close();
    process.exit(0);
  }

  // Migrate images
  console.log('📸 Migrating images...');
  const imagesDir = path.join(uploadsDir, 'images');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir);
    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      if (fs.statSync(filePath).isFile()) {
        console.log(`  Uploading: ${file}`);
        const cloudinaryUrl = await uploadToCloudinary(filePath, 'images', 'image');
        if (cloudinaryUrl) {
          urlMapping[`/uploads/images/${file}`] = cloudinaryUrl;
          console.log(`  ✅ Uploaded: ${file}`);
        }
      }
    }
  }

  // Migrate profile images
  console.log('\n👤 Migrating profile images...');
  const profileDir = path.join(uploadsDir, 'profile');
  if (fs.existsSync(profileDir)) {
    const profileFiles = fs.readdirSync(profileDir);
    for (const file of profileFiles) {
      const filePath = path.join(profileDir, file);
      if (fs.statSync(filePath).isFile()) {
        console.log(`  Uploading: ${file}`);
        const cloudinaryUrl = await uploadToCloudinary(filePath, 'profile', 'image');
        if (cloudinaryUrl) {
          urlMapping[`/uploads/profile/${file}`] = cloudinaryUrl;
          console.log(`  ✅ Uploaded: ${file}`);
        }
      }
    }
  }

  // Migrate project images
  console.log('\n🎨 Migrating project images...');
  const projectsDir = path.join(uploadsDir, 'projects');
  if (fs.existsSync(projectsDir)) {
    const projectFiles = fs.readdirSync(projectsDir);
    for (const file of projectFiles) {
      const filePath = path.join(projectsDir, file);
      if (fs.statSync(filePath).isFile()) {
        console.log(`  Uploading: ${file}`);
        const cloudinaryUrl = await uploadToCloudinary(filePath, 'projects', 'image');
        if (cloudinaryUrl) {
          urlMapping[`/uploads/projects/${file}`] = cloudinaryUrl;
          console.log(`  ✅ Uploaded: ${file}`);
        }
      }
    }
  }

  // Migrate documents
  console.log('\n📄 Migrating documents...');
  const documentsDir = path.join(uploadsDir, 'documents');
  if (fs.existsSync(documentsDir)) {
    const documentFiles = fs.readdirSync(documentsDir);
    for (const file of documentFiles) {
      const filePath = path.join(documentsDir, file);
      if (fs.statSync(filePath).isFile()) {
        console.log(`  Uploading: ${file}`);
        const cloudinaryUrl = await uploadToCloudinary(filePath, 'documents', 'raw');
        if (cloudinaryUrl) {
          urlMapping[`/uploads/documents/${file}`] = cloudinaryUrl;
          console.log(`  ✅ Uploaded: ${file}`);
        }
      }
    }
  }

  // Update database with new URLs
  console.log('\n💾 Updating database...');
  try {
    const portfolio = await Portfolio.findOne();
    
    if (portfolio) {
      let updated = false;

      // Update profile image
      if (portfolio.profile?.profileImage && urlMapping[portfolio.profile.profileImage]) {
        console.log(`  Updating profile image: ${portfolio.profile.profileImage} -> ${urlMapping[portfolio.profile.profileImage]}`);
        portfolio.profile.profileImage = urlMapping[portfolio.profile.profileImage];
        updated = true;
      }

      // Update resume/CV
      if (portfolio.profile?.resume && urlMapping[portfolio.profile.resume]) {
        console.log(`  Updating resume: ${portfolio.profile.resume} -> ${urlMapping[portfolio.profile.resume]}`);
        portfolio.profile.resume = urlMapping[portfolio.profile.resume];
        updated = true;
      }

      // Update project images
      if (portfolio.projects && portfolio.projects.length > 0) {
        portfolio.projects.forEach((project, index) => {
          if (project.image && urlMapping[project.image]) {
            console.log(`  Updating project image: ${project.image} -> ${urlMapping[project.image]}`);
            portfolio.projects[index].image = urlMapping[project.image];
            updated = true;
          }
        });
      }

      if (updated) {
        await portfolio.save();
        console.log('  ✅ Database updated successfully!');
      } else {
        console.log('  ℹ️  No database updates needed.');
      }
    } else {
      console.log('  ⚠️  No portfolio data found in database.');
    }
  } catch (error) {
    console.error('  ❌ Error updating database:', error.message);
  }

  // Save mapping to file
  console.log('\n💾 Saving URL mapping...');
  fs.writeFileSync(
    path.join(__dirname, 'cloudinary-migration-map.json'),
    JSON.stringify(urlMapping, null, 2)
  );
  console.log('  ✅ Mapping saved to cloudinary-migration-map.json');

  console.log('\n✨ Migration complete!');
  console.log(`\n📊 Summary:`);
  console.log(`  Total files migrated: ${Object.keys(urlMapping).length}`);
  console.log(`\n⚠️  Note: Old local files are still in the uploads/ directory.`);
  console.log(`  You can safely delete them after verifying everything works.`);

  await mongoose.connection.close();
  process.exit(0);
}
