const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

const corsOptions = {
  origin: [process.env.ALLOWED_FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};

app.use(cors(corsOptions)); 
app.use(express.json());

const chatRoutes = require('./routes/chat');
const healthRoutes = require('./routes/health');
const sessionRoutes = require('./routes/sessions');

const { errorHandler } = require('./middleware/errorHandler');

app.use('/api/chat', chatRoutes);
app.use('/api/healthcheck', healthRoutes);
app.use('/api/sessions', sessionRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
