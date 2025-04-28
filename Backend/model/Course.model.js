import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;
