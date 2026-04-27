const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn(
      'MONGODB_URI is missing. Create a .env file in backend/ before testing database features.'
    );
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'blog',
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

app.use(express.json());
app.use(express.static(publicDir));

app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Server error' });
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API: /api/posts');
  });
});