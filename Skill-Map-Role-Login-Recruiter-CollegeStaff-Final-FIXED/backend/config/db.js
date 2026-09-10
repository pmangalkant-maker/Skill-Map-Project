import mongoose from "mongoose";

// Disable buffering so Mongoose never hangs requests if disconnected
mongoose.set("bufferCommands", false);

export function maskMongoUri(uri) {
  if (!uri) return "";
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/i, "$1*****$3");
}

export default async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || !uri.trim()) {
    const errorMsg = "MongoDB Connection Error: MONGO_URI environment variable is missing. Please set MONGO_URI in your environment variables.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected successfully to host: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    const isAuthError =
      error.code === 8000 ||
      /auth/i.test(error.message) ||
      /bad auth/i.test(error.message) ||
      error.name === "MongoServerError";

    if (isAuthError) {
      console.error("MongoDB Authentication Failed: Invalid credentials provided. Please verify your username and password in MONGO_URI (credentials masked for security).");
    } else {
      console.error(`MongoDB Connection Failed: ${error.message} (Target: ${maskMongoUri(uri)})`);
    }

    throw error;
  }
}
