
import express from 'express';
import Albums from '../controllers/albums.mjs';

const router = express.Router();

router.post('/', Albums.create);

router.get('/', Albums.getAll);

router.get('/:id', Albums.getById);

router.put('/:id', Albums.update);

router.delete('/:id', Albums.delete);

router.post('/:id/photos', Albums.addPhoto);

router.post('/:id/photos/:photoId/comments', Albums.addComment);

export default router;
