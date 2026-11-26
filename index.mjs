import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.mjs';
import usersRouter from './routes/users.mjs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);

connectDB();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bonjour : My Social Networks API SAIED Nabil',
    status: 'API is running'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});