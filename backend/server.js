require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const campaignRoutes = require('./src/routes/campaign.routes');
const { initSocket } = require('./src/socket/socket');

const app = express(;
const server = http.createServer(app);

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true  // needed for httpOnly cookies to flow cross-origin
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);

// Initialize WebSocket server
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };