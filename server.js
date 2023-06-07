// /server.js

/**
 * Required modules
 */
const express = require('express'); // Express.js framework for building web applications
const http = require('http'); // Node.js HTTP module for creating server
const socket = require('socket.io'); // Socket.IO for real-time communication
const cors = require('cors'); // Cross-Origin Resource Sharing middleware
const bodyParser = require('body-parser'); // Body parsing middleware
const config = require('config'); // Configuration module

const connectDB = require('./config/db'); // Custom module to connect to MongoDB database
const auth = require('./middleware/auth'); // Custom authentication middleware
const { getUserId, getToUserId } = require('./middleware/socket'); // Custom middleware functions
const User = require('./models/User'); // User model

const app = express(); // Create an Express application
const server = http.createServer(app); // Create an HTTP server using Express app
const io = socket(server, { // Create Socket.IO instance with server
    cors: {
        origin: "http://localhost:3000", // Set the allowed origin for CORS
        credentials: true, // Enable CORS credentials
    },
});

const onlineUsers = new Map(); // Create a Map to store online users

/**
 * Socket.IO Configuration
 */
io.on("connection", (socket) => {
    console.log("New connection");

    // Event listener that adds a new user to the onlineUsers map
    socket.on("add_user", (token) => {
        try {
            const userId = getUserId(token);
            onlineUsers.set(userId, socket.id);
            console.log(onlineUsers);
        } catch (err) {
            console.log(err);
        }
    });

    // Event listener that handles a new message
    socket.on("send_msg", async (msg) => {
        try {
            const toUserId = await getToUserId(msg.match, msg.sender);
            const sendToUserSocket = onlineUsers.get(toUserId);
            console.log(toUserId);
            if (sendToUserSocket) {
                socket.to(sendToUserSocket).emit("msg_recieve", msg);
            }
            console.log(msg);
        } catch (err) {
            console.log(err);
        }
    });
});

/**
 * Middleware Setup
 */
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json({ limit: '50mb' })); // Set a higher payload limit for parsing request bodies
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/**
 * Database Connection
 */
connectDB(); // Connect to MongoDB database

/**
 * Initialize Middleware
 */
app.use(express.json({ extended: false }));

/**
 * Route Configuration
 */
app.use('/login', require('./routes/auth/login')); // Login route
app.use('/register', require('./routes/auth/register')); // Register route
app.use('/api/users', auth, require('./routes/api/users')); // Users API route
app.use('/api/plans', auth, require('./routes/api/plans')); // Plans API route
app.use('/api/matches', auth, require('./routes/api/matches')); // Matches API route
app.use('/api/swipes', auth, require('./routes/api/swipes')); // Swipes API route
app.use('/api/messages', auth, require('./routes/api/messages')); // Messages API route
app.use('/api/notifications', auth, require('./routes/api/notifications'));

/**
 * Root Endpoint
 */
app.get('/', (req, res) => res.send('Hello World!'));

/**
 * Start the Server
 */
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));
