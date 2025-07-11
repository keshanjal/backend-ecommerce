import mongoose from 'mongoose';
import dotenv from 'dotenv';
import data from './data.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/amazona');

    // Clear old data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Insert users
    const createdUsers = await User.insertMany(data.users);
    const adminUser = createdUsers[0]; // First user is admin

    // Insert products and assign admin as owner
   const sampleProducts = data.products.map((product) => ({
  ...product,
  user: adminUser._id,
  seller: {
    _id: adminUser._id,
    seller: {
      name: adminUser.seller.name,
    },
  },
}));

    await Product.insertMany(sampleProducts);

    console.log('✅ Seeding successful!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
