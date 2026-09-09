const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Create a .env file from .env.example.');
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI);

  console.log(
    `Database connected: ${connection.connection.host}:${connection.connection.port}/${connection.connection.name}`
  );

  return connection;
};

module.exports = connectDB;
