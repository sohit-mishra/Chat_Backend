const express = require('express');
const cors = require('cors');
const connectToDataBase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const convRoutes = require('./routes/conversationsRoutes');
const env = require('./config/env');
const http = require('http');
const { setupChatSockets } = require('./sockets/chat');

const app = express();

app.use(express.json());
app.use(cors({ origin: env.CLIENT_URL || '*' }));

app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Server is running 🚀" 
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("✅ API is healthy");
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/conversations', convRoutes);

const server = http.createServer(app);


const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: env.CLIENT_URL || '*' } });
setupChatSockets(io);


const PORT = env.PORT || 4000;
const HOST = "0.0.0.0";

(async () => {
  try {
    await connectToDataBase();
    server.listen(PORT,HOST, () => {
      console.log(`Server running on port http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
})();
