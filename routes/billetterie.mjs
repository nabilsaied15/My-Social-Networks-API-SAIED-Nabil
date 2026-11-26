import express from 'express';
import BilletterieController from '../controllers/billetterie.mjs';

const router = express.Router();

router.post('/', BilletterieController.create);

router.get('/', BilletterieController.getAll);

router.get('/:id', BilletterieController.getById);

router.put('/:id', BilletterieController.update);

router.delete('/:id', BilletterieController.delete);

router.post('/:id/acheter', BilletterieController.acheterBillet);

export default router;
