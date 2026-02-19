const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MongoDB Connection Error: MONGO_URI is not set");
    console.error("🔍 Add MONGO_URI (or MONGODB_URI) in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
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
