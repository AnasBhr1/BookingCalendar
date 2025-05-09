const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const userRoutes = require('./routes/userRoutes');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a room based on user ID
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  
  // Listen for booking updates
  socket.on('bookingUpdated', (data) => {
    // Broadcast to all connected clients except sender
    socket.broadcast.emit('bookingUpdated', data);
  });
  
  // Listen for availability updates
  socket.on('availabilityUpdated', (data) => {
    // Broadcast to all connected clients except sender
    socket.broadcast.emit('availabilityUpdated', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to our controllers
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/google', googleCalendarRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Booking Calendar API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});