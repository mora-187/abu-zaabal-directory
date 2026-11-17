const express = require('express');
const cors = require('cors');
const providerRoutes = require("./routes/providerRoutes");
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Abu Zaabal Directory API'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});
app.use("/api/providers", providerRoutes);
app.use("/api/auth", authRoutes);
app.use('/api', categoryRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

app.use(errorHandler);

module.exports = app;
