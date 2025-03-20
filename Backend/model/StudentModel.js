import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  enrollmentNo: { type: String , unique :true },
  admissionNo: { type: String, unique: true },
  mobile: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true }, // Reference to Batch
  profileImage: { 
    url:String,
    publicId:String
  }, // To store the image URL or file path
  certificates: [
    {
      fileName: String,
      file: {
        publicId:String ,
        url:String
      } // To store the certificate file URL or path  
    }
  ]
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;
