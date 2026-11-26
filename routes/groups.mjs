import express from 'express';
import Groups from '../controllers/groups.mjs';

const router = express.Router();

router.post('/', Groups.create);

router.get('/', Groups.getAll);

router.get('/:id', Groups.getById);

router.put('/:id', Groups.update);

router.delete('/:id', Groups.delete);

export default router;
