import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  course: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  instructor: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Reference to students
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);
export default Batch;
