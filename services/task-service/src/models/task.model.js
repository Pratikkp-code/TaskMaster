import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const TaskSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
       type: String,
       trim: true,
    },
    status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  comments: [CommentSchema],
  attachments: [{
    fileName: String,
    url: String,
  }],
  location: {
    address: { type: String, default: '' },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
}, {
  timestamps: true,
});

TaskSchema.index({ title: 'text', description: 'text' });
const Task = mongoose.model('Task',TaskSchema);
export default Task;