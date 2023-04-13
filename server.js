// /server.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const auth = require('./middleware/auth'); // import auth middleware

const app = express();

// Connect to MongoDB database
connectDB();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/login', require('./routes/auth/login'));
app.use('/register', require('./routes/auth/register'));
app.use('/api/users', auth, require('./routes/api/users'));

// Root endpoint
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
