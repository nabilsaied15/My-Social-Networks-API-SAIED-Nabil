
import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  organizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
