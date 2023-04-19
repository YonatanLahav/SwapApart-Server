// /server.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const auth = require('./middleware/auth'); // import auth middleware
const bodyParser = require('body-parser');

const app = express();

// set a higher payload limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
app.use('/api/plans', auth, require('./routes/api/plans'));
app.use('/api/swipes', auth, require('./routes/api/swipes'));
app.use('/api/conversations', auth, require('./routes/api/conversations'));

// Root endpoint
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
