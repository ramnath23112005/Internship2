const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { setIO } = require('./socket');

const seedData = require('./seed');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const donationRoutes = require('./routes/donations');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const certificateRoutes = require('./routes/certificates');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.frontendUrl,
    methods: ['GET', 'POST'],
  },
});

setIO(io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/seed', async (req, res) => {
  try {
    const result = await seedData();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use(errorHandler);

connectDB().then(() => {
  server.listen(env.port, () => {
    console.log(`ImpactX API running on port ${env.port}`);
  });
});

module.exports = { app, server };
