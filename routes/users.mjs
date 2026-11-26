import express from 'express';
import Users from '../controllers/users.mjs';

const router = express.Router();

router.post('/', Users.create);

router.get('/', Users.getAll);

router.get('/:id', Users.getById);

router.put('/:id', Users.update);

router.delete('/:id', Users.delete);

export default router;
