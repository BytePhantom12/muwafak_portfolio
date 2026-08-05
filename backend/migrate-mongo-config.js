require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.MONGODB_URI || process.env.MONGODB_URL,
    databaseName: "portfolio",
  },

  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};

module.exports = config;