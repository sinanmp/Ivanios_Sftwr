import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  enrollmentNo: { type: String },
  rollNo: { type: String, unique: true },
  mobile: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true }, // Reference to Batch
  profileImage: { type: String }, // To store the image URL or file path
  certificates: [
    {
      fileName: String,
      fileUrl: String // To store the certificate file URL or path  
    }
  ]
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;
