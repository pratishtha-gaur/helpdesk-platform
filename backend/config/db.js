import mongoose from "mongoose";

// This function connects our backend to the MongoDB database.
// It's "async" because connecting to a database over the internet
// takes time — we must wait for it to finish before continuing.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If the database can't connect, there's no point running the server.
    // process.exit(1) stops the whole program.
    process.exit(1);
  }
};

export default connectDB;
