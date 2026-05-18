import mongoose from 'mongoose';
import { config } from 'dotenv';

config();
const externalMongoUri = process.env.MONGO_URI;

beforeAll(async () => {
  if (!externalMongoUri) {
    throw new Error('MONGO_URI is required for API integration tests.');
  }

  process.env.JWT_SECRET = 'testsecretkeytestsecretkeytestsec';
  process.env.JWT_EXPIRES_IN = '24h';
  process.env.CLIENT_ORIGIN = 'http://localhost:5173';
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
}, 120000);

beforeEach(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI ?? externalMongoUri ?? '');
  }
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  const promises = Object.values(collections).map((collection) => collection.deleteMany({}));
  await Promise.all(promises);
});
