import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  enrollmentNo: { type: String, required: true, unique: true },
  phone:{type:String , required:true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },  // Reference to Batch
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;
