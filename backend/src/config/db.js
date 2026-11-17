const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is missing. Create a .env file from .env.example"
    );
  }

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Connection already in progress
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongooseInstance) => {
        console.log(
          `Database connected: ${mongooseInstance.connection.host}:${mongooseInstance.connection.port}/${mongooseInstance.connection.name}`
        );

        return mongooseInstance.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;