const express = require('express');
const cors = require('cors');
const providerRoutes = require("./routes/providerRoutes");
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require("./middleware/errorHandler");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/providers", providerRoutes);

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

app.use('/api', categoryRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

app.use(errorHandler);

module.exports = app;
