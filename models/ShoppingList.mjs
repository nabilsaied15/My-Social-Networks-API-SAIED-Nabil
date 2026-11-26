import mongoose from 'mongoose';
const shoppingListSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  quantite: {
    type: Number,
    required: true,
    min: 1,
  },
  heureArrivee: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

shoppingListSchema.index(
  { event: 1, nom: 1 },
  { unique: true },
);

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

export default ShoppingList;
