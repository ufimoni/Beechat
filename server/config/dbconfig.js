const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.Conn_Str, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

// Get the connection
const db = mongoose.connection;

// Success
db.on('connected', () => {
  console.log('Database Connected Successfully!');
});

// Error
db.on('error', (err) => {
  console.error('Error in connecting to the database:', err);
});

module.exports = db;