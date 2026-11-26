import express from 'express';
import ShoppingListController from '../controllers/shoppingList.mjs';

const router = express.Router();

router.post('/', ShoppingListController.create);

router.get('/', ShoppingListController.getAll);

router.get('/:id', ShoppingListController.getById);

router.put('/:id', ShoppingListController.update);

router.delete('/:id', ShoppingListController.delete);

export default router;
