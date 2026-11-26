import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.mjs';
import usersRouter from './routes/users.mjs';
import eventsRouter from './routes/events.mjs';
import groupsRouter from './routes/groups.mjs';
import discussionsRouter from './routes/discussions.mjs';
import albumsRouter from './routes/albums.mjs';
import sondagesRouter from './routes/sondages.mjs';
import billetterieRouter from './routes/billetterie.mjs';

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
app.use('/groups', groupsRouter);
app.use('/discussions', discussionsRouter);
app.use('/albums', albumsRouter);
app.use('/sondages', sondagesRouter);
app.use('/billetterie', billetterieRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
