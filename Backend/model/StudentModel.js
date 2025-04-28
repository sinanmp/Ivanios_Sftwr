import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  enrollmentNo: { type: String, required: true, unique: true },
  admissionNo: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  totalFees: { type: Number, required: true }, 
  feesPaid: { type: Number, required: true },
  profileImage: { 
    url:String ,
    publicId:String
   }, // Now storing Cloudinary URL
  certificates: [
    {
      type: {
        type: String,
        required: true
      },
      otherType: {
        type: String,
        default: ''
      },
      url: {
        type: String, // Now storing Cloudinary URL
        required: true
      },
      publicId:String
    }
  ]
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;
