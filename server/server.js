// In server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// We are temporarily removing dotenv for debugging.
// require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// IMPORTANT: Hardcoded MongoDB Connection String for debugging
const MONGO_URI = "mongodb+srv://garvitarora:Garvit123@cluster0.0zsndfp.mongodb.net/complaint-system?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB using the hardcoded string
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
const complaintRoutes = require('./routes/complaints');
app.use('/api/complaints', complaintRoutes);

// In server/server.js

// ... after the complaintRoutes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});