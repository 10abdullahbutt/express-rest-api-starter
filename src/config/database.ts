import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env['NODE_ENV'] === 'test'
        ? process.env['MONGODB_URI_TEST']
        : process.env['MONGODB_URI'];

    if (!mongoUri)
      throw new Error('MongoDB URI is not defined in environment variables');

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.log('error', error);
    console.error('❌ MongoDB connection error:', error);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};
