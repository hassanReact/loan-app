// lib/db.ts
import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  try {
    if (isConnected) return;

    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;

    // Dynamically import all models
    await Promise.all([
      import('@/models/User'),
      import('@/models/Loan'),
      import('@/models/Support'),
    ]);

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
