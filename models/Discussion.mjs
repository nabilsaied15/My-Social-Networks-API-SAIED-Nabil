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

const messageSchema = new mongoose.Schema({
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
  comments: {
    type: [commentSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null,
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
}, {
  timestamps: true,
});

discussionSchema.pre('validate', function () {
  if ((!this.group && !this.event) || (this.group && this.event)) {
    this.invalidate(
      'group',
      'Une discussion doit être liée à un groupe ou à un événement, mais pas aux deux.'
    );
  }
});

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;
