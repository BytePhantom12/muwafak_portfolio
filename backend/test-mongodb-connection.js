const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!uri) {
  console.error('MONGODB_URI or MONGODB_URL is not set.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection failed.');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
