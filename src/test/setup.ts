import 'tsconfig-paths/register';

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '@/config/database';

// Global test setup
beforeAll(async () => {
  await connectDB();
});

// Global test teardown
afterAll(async () => {
  await disconnectDB();
});

// Clean up database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection) await collection.deleteMany({});
  }
});
