import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.mjs';
import usersRouter from './routes/users.mjs';
import eventsRouter from './routes/events.mjs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bonjour : My Social Networks API SAIED Nabil',
    status: 'API is running',
  });
});

app.use('/users', usersRouter);
app.use('/events', eventsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
