// /server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const auth = require('./middleware/auth'); // import auth middleware
const bodyParser = require('body-parser');
const http = require('http');
const jwt = require('jsonwebtoken');
const config = require('config');
const socket = require('socket.io');
const { getUserId, getToUserId } = require('./middleware/socket');
const User = require('./models/User');
const app = express();

// Create http server
const server = http.createServer(app);

/**
 * Socket.io
 */
// Create the socket
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

var onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("new connection");
    // Event listener that add a new user to onlineUser map.
    socket.on("add_user", (token) => {
        const userId = getUserId(token);
        onlineUsers.set(userId, socket.id);
        console.log(onlineUsers);
    });
    // Event listener that handle a new message.
    // msg = { match, sender, text}
    socket.on("send_msg", async (msg) => {
        const toUserId = await getToUserId(msg.match, msg.sender);
        const sendToUserSocket = onlineUsers.get(toUserId);
        console.log(toUserId)
        if (sendToUserSocket) {
            socket.to(sendToUserSocket).emit("msg_recieve", msg);
        }
        console.log(msg);
    });
});
/**
 * 
 */

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Set a higher payload limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Connect to MongoDB database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/login', require('./routes/auth/login'));
app.use('/register', require('./routes/auth/register'));
app.use('/api/users', auth, require('./routes/api/users'));
app.use('/api/plans', auth, require('./routes/api/plans'));
app.use('/api/matches', auth, require('./routes/api/matches'));
app.use('/api/swipes', auth, require('./routes/api/swipes'));
app.use('/api/messages', auth, require('./routes/api/messages'));

// Root endpoint
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));
