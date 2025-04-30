import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to Course model
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], 
}, { timestamps: true });

const BatchModel = mongoose.model('Batch', batchSchema);
export default BatchModel;
   