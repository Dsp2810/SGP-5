const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("🔍 Check your MONGO_URI in .env file");
    console.error("💡 Make sure MongoDB Atlas cluster is running and whitelist your IP");
    process.exit(1);
  }
};

module.exports = connectDB;
