const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Campaign = require('../models/Campaign');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  // Auth middleware for every socket connection
  io.use(async (socket, next) => {
    try {
      // cookie-parser doesn't run on sockets — parse manually
      const cookieHeader = socket.handshake.headers.cookie || '';
      const tokenCookie = cookieHeader
        .split(';')
        .find(c => c.trim().startsWith('token='));

      if (!tokenCookie) return next(new Error('Not authenticated'));

      const token = tokenCookie.split('=')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) return next(new Error('User not found'));

      socket.user = user; // attach user to socket instance
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.name}`);

    // Client joins a campaign room to receive its updates
    socket.on('join:campaign', async (campaignId) => {
      try {
        // verify user owns this campaign before letting them join
        const campaign = await Campaign.findOne({
          _id: campaignId,
          user: socket.user._id
        });
        if (!campaign) {
          socket.emit('error', { message: 'Campaign not found' });
          return;
        }
        socket.join(`campaign:${campaignId}`);
        socket.emit('joined', { campaignId });
        console.log(`${socket.user.name} joined campaign:${campaignId}`);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    // Client leaves a campaign room
    socket.on('leave:campaign', (campaignId) => {
      socket.leave(`campaign:${campaignId}`);
      console.log(`${socket.user.name} left campaign:${campaignId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user.name}`);
    });
  });

  // Start metric simulation
  startMetricSimulator();

  return io;
};

// Simulate live metric updates for all active campaigns
const startMetricSimulator = () => {
  setInterval(async () => {
    try {
      const activeCampaigns = await Campaign.find({ status: 'active' });

      for (const campaign of activeCampaigns) {
        // random increments — realistic enough for a demo
        const update = {
          campaignId: campaign._id,
          metrics: {
            clicks: campaign.metrics.clicks + Math.floor(Math.random() * 10),
            impressions: campaign.metrics.impressions + Math.floor(Math.random() * 100),
            conversions: campaign.metrics.conversions + Math.floor(Math.random() * 3)
          },
          spent: Math.min(
            campaign.spent + parseFloat((Math.random() * 10).toFixed(2)),
            campaign.budget  // never exceed budget
          ),
          timestamp: new Date().toISOString()
        };

        // persist updated metrics to DB
        await Campaign.findByIdAndUpdate(campaign._id, {
          metrics: update.metrics,
          spent: update.spent
        });

        // emit only to sockets in this campaign's room
        io.to(`campaign:${campaign._id}`).emit('metrics:update', update);
      }
    } catch (err) {
      console.error('Simulator error:', err.message);
    }
  }, 3000); // every 3 seconds
};

// utility to get io instance elsewhere if needed
const getIO = () => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};

module.exports = { initSocket, getIO };