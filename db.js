import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.error('Authentication failed. Check MONGODB_URI credentials.');
    }
    process.exit(1);
  }
};

export default connectDB;