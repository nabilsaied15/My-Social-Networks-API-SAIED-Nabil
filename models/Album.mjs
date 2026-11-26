import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const albumSchema = new mongoose.Schema({
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
  photos: {
    type: [photoSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const Album = mongoose.model('Album', albumSchema);
export default Album;
