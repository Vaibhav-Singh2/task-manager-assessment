import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'testsecretkeytestsecretkeytestsec';
  process.env.JWT_EXPIRES_IN = '24h';
  process.env.CLIENT_ORIGIN = 'http://localhost:5173';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  const promises = Object.values(collections).map((collection) => collection.deleteMany({}));
  await Promise.all(promises);
});
