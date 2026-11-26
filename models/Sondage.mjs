import mongoose from 'mongoose';
const reponseSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  reponses: {
    type: [reponseSchema],
    validate: {
      validator: (reponses) => reponses.length >= 2,
      message: 'Une question doit avoir au moins deux réponses.',
    },
  },
});

const voteSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reponse: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const sondageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: (questions) => questions.length >= 1,
      message: 'Un sondage doit contenir au moins une question.',
    },
  },
  votes: {
    type: [voteSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const Sondage = mongoose.model('Sondage', sondageSchema);

export default Sondage;
