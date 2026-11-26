import express from 'express';
import Discussions from '../controllers/discussions.mjs';

const router = express.Router();

router.post('/', Discussions.create);

router.get('/', Discussions.getAll);

router.get('/:id', Discussions.getById);

router.put('/:id', Discussions.update);

router.delete('/:id', Discussions.delete);

router.post('/:id/messages', Discussions.addMessage);

router.post('/:id/messages/:messageId/comments', Discussions.addComment);

export default router;
