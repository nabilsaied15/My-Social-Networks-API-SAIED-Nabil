import express from 'express';
import Events from '../controllers/events.mjs';

const router = express.Router();

router.post('/', Events.create);

router.get('/', Events.getAll);

router.get('/:id', Events.getById);

router.put('/:id', Events.update);

router.delete('/:id', Events.delete);

export default router;
