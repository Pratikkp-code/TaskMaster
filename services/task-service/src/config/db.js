import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log('Task Service : \n Mongodb connected successfully !! DB HOST:',`${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('Task Service : \n Mongodb connection failed !!', error.message);
    }
};
export default connectDB;