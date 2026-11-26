import express from 'express';
import Sondages from '../controllers/sondages.mjs';

const router = express.Router();

router.post('/', Sondages.create);

router.get('/', Sondages.getAll);

router.get('/:id', Sondages.getById);

router.put('/:id', Sondages.update);

router.delete('/:id', Sondages.delete);

router.post('/:id/votes', Sondages.vote);

export default router;
