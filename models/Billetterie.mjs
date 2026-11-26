import mongoose from 'mongoose';
const typeBilletSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  montant: {
    type: Number,
    required: true,
    min: 0,
  },
  quantite: {
    type: Number,
    required: true,
    min: 1,
  },
});

const billetAcheteSchema = new mongoose.Schema({
  typeBillet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  adresse: {
    type: String,
    required: true,
    trim: true,
  },
  dateAchat: {
    type: Date,
    default: Date.now,
  },
});

const billetterieSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    unique: true,
  },
  typesBillets: {
    type: [typeBilletSchema],
    default: [],
  },
  billetsAchetes: {
    type: [billetAcheteSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const Billetterie = mongoose.model('Billetterie', billetterieSchema);

export default Billetterie;
