import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("\n Mongodb connected successfully !! DB HOST:",`${connectionInstance.connection.host}`);
  } catch (err) {
    console.error(`Auth Service DB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;

