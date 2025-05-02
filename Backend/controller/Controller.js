import BatchModel from "../model/BatchModel.js";
import Batch from "../model/BatchModel.js";
import Course from "../model/Course.model.js";
import Student from "../model/StudentModel.js";
import { deleteFromCloudinary, deleteMultipleFromCloudinary } from "../services/CloudinaryDelete.js";
import 'dotenv/config';

class Controller {


  static async checkExistingStudent(req, res) {
    try {
      const { admissionNo, email, enrollmentNo } = req.body;
  
      const existingStudents = await Student.find({
        $or: [
          { admissionNo },
          { email },
          { enrollmentNo }
        ]
      });
  
      const result = {
        admissionNoExists: false,
        emailExists: false,
        enrollmentNoExists: false
      };
  
      for (const student of existingStudents) {
        if (student.admissionNo === admissionNo) result.admissionNoExists = true;
        if (student.email === email) result.emailExists = true;
        if (student.enrollmentNo === enrollmentNo) result.enrollmentNoExists = true;
      }
  
      res.status(200).json({
        error: false,
        message: "Check complete",
        result
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Internal server error"
      });
    }
  }
  



  static async adminLogin(req, res) {
    try {
      const { username, password } = req.body
      if (process.env.ADMIN_USERNAME !== username) {
        return res.status(400).json({
          error: true,
          message: "username is incorrect",
          field: 'username'
        })
      }

      if (process.env.ADMIN_PASSWORD !== password) {
        return res.status(400).json({
          error: true,
          message: "password is incorrect",
          field: "password"
        })
      }

      res.status(200).json({
        error: false,
        message: "admin logged in successfully !!"
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error when logging admin", error: true });
    }
  }

  static async createBatch(req, res) {
    try {
      const { batchName, courses, startDate, endDate, description } = req.body;

      // Validate that all courses exist
      const existingCourses = await Course.find({ _id: { $in: courses } });
      if (existingCourses.length !== courses.length) {
        return res.status(400).json({
          error: true,
          message: "One or more courses not found"
        });
      }

      const newBatch = new BatchModel({
        batchName,
        courses, // Now storing only course IDs
        startDate,
        endDate,
        description
      });

      await newBatch.save();

      res.status(201).json({
        error: false,
        message: "Batch created successfully",
        batch: newBatch
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Error creating batch"
      });
    }
  }

  // Get all batches
  static async getAllBatches(req, res) {
    try {
      const batches = await BatchModel.find()
        .populate('courses', 'name duration fees description'); // Populate course details

      res.status(200).json({
        error: false,
        batches: batches
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        error: true,
        message: "Error retrieving batches" 
      });
    }
  }

  // Get all students in a specific batch
  static async getStudentsInBatch(req, res) {
    try {
      const { batchId } = req.query;

      // Find the batch and populate the students
      const batch = await Batch.findById(batchId).populate('students');

      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }

      res.status(200).json({
        error: false,
        students: batch.students
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving students", error: true });
    }
  } 

  // Add a student to a batch
  static async addStudentToBatch(req, res) {
    try {
      const { data } = req.body;
      const { email, phone, batch, totalFees, feesPaid, profileImage, certificates } = data;

      const sbatch = await BatchModel.findOne({ _id: batch });

      if (!sbatch) {
        return res.status(404).json({ error: true, message: "Batch not found" });
      }

      // Create the new student and associate it with the batch
      const newStudent = new Student({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        enrollmentNo: data.enrollmentNo,
        admissionNo: data.admissionNo,
        profileImage: profileImage, // Now storing Cloudinary URL
        certificates: certificates, // Now storing array of certificate objects with URLs
        batch: sbatch._id,
        totalFees: totalFees,
        feesPaid: feesPaid
      });

      // Save the student to the database
      await newStudent.save();

      // Add the student reference to the batch's students list
      sbatch.students.push(newStudent._id);
      await sbatch.save();

      res.status(201).json({
        error: false,
        message: "Student added to batch successfully",
        student: newStudent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding student to batch", error: true });
    }
  }


  static async fetchStudents(req, res) {
    const { page = 1, limit = 10, search = '' } = req.query;
    try {
      const students = await Student.find({
        name: { $regex: search, $options: 'i' },
      })
        .populate('batch', 'batchName') // <-- populate batchName here
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const total = await Student.countDocuments({
        name: { $regex: search, $options: 'i' },
      });
  
      res.status(200).json({
        error: false,
        students,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      res.status(500).json({ error: true, message: "Error fetching students" });
    }
  }
  

  static async getStudentDetails(req, res) {
    try {
      const id = req.query.id
      const student = await Student.findOne({ _id: id }).populate("batch");
      res.status(200).json({
        error: false,
        student: student
      })
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "internal server error"
      })
    }
  }

  static async getBatchDetails(req, res) {
    try {
      const id = req.query.id;
      const batch = await BatchModel.findById(id)
        .populate('courses', 'name duration fees description') // Populate course details
        .populate({
          path: 'students',
          select: 'name email enrollmentNo admissionNo profileImage'
        });

      if (!batch) {
        return res.status(404).json({
          error: true,
          message: "Batch not found"
        });
      }
      
      res.status(200).json({
        error: false,
        message: "Batch fetched successfully",
        batch: batch
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Internal server error"
      });
    }
  }



  static async getCourses(req,res){
    try {
      const result = await Course.find()
      res.status(200).json({
        error:false,
        message:"courses fetched successfully",
        data:result
      })
    } catch (error) {
      res.status(500).json({
        error:true ,
        message:"internel server error"
      })
    }
  }

  static async addCourse(req, res) {
    try {
      const { name, duration, fees, description } = req.body;

      // Create a new course
      const newCourse = new Course({
        name,
        duration,
        fees,
        description
      });

      // Save to the database
      await newCourse.save();

      res.status(201).json({
        error: false,
        message: "Course added successfully",
        course: newCourse
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        res.status(400).json({
          error: true,
          message: "Course with this name already exists"
        });
      } else {
        res.status(500).json({
          error: true,
          message: "Error adding course"
        });
      }
    }
  }

  static async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndDelete(id);
      if (!course) {
        return res.status(404).json({
          error: true,
          message: "Course not found"
        });
      }
      res.status(200).json({
        error: false,
        message: "Course deleted successfully"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Error deleting course"
      });
    }
  }

  static async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { name, duration, fees, description } = req.body;
      const course = await Course.findByIdAndUpdate(
        id,
        { name, duration, fees, description },
        { new: true }
      );
      if (!course) {
        return res.status(404).json({
          error: true,
          message: "Course not found"
        });
      }
      res.status(200).json({
        error: false,
        message: "Course updated successfully",
        course
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        res.status(400).json({
          error: true,
          message: "Course with this name already exists"
        });
      } else {
        res.status(500).json({
          error: true,
          message: "Error updating course"
        });
      }
    }
  }

  static async getCourseDetails(req, res) {
    try {
      const id = req.query.id;
      const course = await Course.findOne({ _id: id });
      
      if (!course) {
        return res.status(404).json({
          error: true,
          message: "Course not found"
        });
      }

      res.status(200).json({
        error: false,
        message: "Course fetched successfully",
        data: course
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Internal server error"
      });
    }
  }

  // Delete a student
  static async deleteStudent(req, res) {
    try {
      const { id } = req.query;
      
      // First find the student to get their files
      const student = await Student.findById(id);
      
      if (!student) {
        return res.status(404).json({
          error: true,
          message: "Student not found"
        });
      }

      // Delete profile image from Cloudinary if exists
      if (student.profileImage?.publicId) {
        try {
          await deleteFromCloudinary(student.profileImage.public_id);
        } catch (cloudinaryError) {
          console.error('Error deleting profile image from Cloudinary:', cloudinaryError);
          // Continue with student deletion even if Cloudinary deletion fails
        }
      }

      // Delete certificates from Cloudinary if any exist
      if (student.certificates && student.certificates.length > 0) {
        try {
          const certificatePublicIds = student.certificates
            .map(cert => cert.publicId)
            .filter(id => id); // Filter out any null/undefined values
          
          if (certificatePublicIds.length > 0) {
            await deleteMultipleFromCloudinary(certificatePublicIds);
          }
        } catch (cloudinaryError) {
          console.error('Error deleting certificates from Cloudinary:', cloudinaryError);
          // Continue with student deletion even if Cloudinary deletion fails
        }
      }

      // Now delete the student from database
      await Student.findByIdAndDelete(id);

      // Remove student reference from the batch
      if (student.batch) {
        await BatchModel.findByIdAndUpdate(
          student.batch,
          { $pull: { students: id } }
        );
      }

      res.status(200).json({
        error: false,
        message: "Student and associated files deleted successfully"
      });
    } catch (error) {
      console.error('Error in deleteStudent:', error);
      res.status(500).json({
        error: true,
        message: "Error deleting student"
      });
    }
  }

  static async updateStudent(req, res) {
    try {
      const { id } = req.query;
      const { name, email, mobile, enrollmentNo, admissionNo, certificates = [] } = req.body;
  
      const student = await Student.findById(id);
  
      if (!student) {
        return res.status(404).json({
          error: true,
          message: "Student not found"
        });
      }
  
      // Merge old certificates + new certificates
      const updatedCertificates = [...student.certificates, ...certificates];
  
      // Update student fields
      student.name = name;
      student.email = email;
      student.mobile = mobile;
      student.enrollmentNo = enrollmentNo;
      student.admissionNo = admissionNo;
      student.certificates = updatedCertificates;
  
      // Save updated student
      await student.save();
  
      res.status(200).json({
        error: false,
        message: "Student updated successfully",
        student
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Error updating student"
      });
    }
  }

  static async addStudent(req, res) {
    try {
      const { name, email, mobile, enrollmentNo, admissionNo, profileImage, certificates, batch, totalFees, feesPaid ,feeTransactions} = req.body;

      // Check if student with same email or enrollment number already exists
      const existingStudent = await Student.findOne({
        $or: [
          { email: email },
          { enrollmentNo: enrollmentNo },
          {admissionNo:admissionNo}
        ]
      });

      if (existingStudent) {
        return res.status(400).json({
          error: true,
          message: "Student with this email or enrollment number or admission number already exists"
        });
      }

      const newFeeTransactions = feeTransactions.map(transaction => ({
        ...transaction,
        amount: parseFloat(feesPaid)
      }));
      // Create new student
      const newStudent = new Student({
        name,
        email,
        mobile,
        enrollmentNo,
        admissionNo,
        profileImage,
        certificates,
        batch,
        totalFees,
        feesPaid,
        feeTransactions: newFeeTransactions
      });

      await BatchModel.findByIdAndUpdate(batch, { $push: { students: newStudent._id } });

      await newStudent.save();

      res.status(201).json({
        error: false,
        message: "Student added successfully",
        student: newStudent
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Error adding student"
      });
    }
  }

  static async addFeePayment(req, res) {
    try {
      const { id } = req.query;
      const { amount, date } = req.body;

      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          error: true,
          message: "Student not found"
        });
      }

      // Add the new fee transaction
      const newTransaction = {
        amount: parseFloat(amount),
        date: new Date(date),
        createdAt: new Date()
      };

      // Update student's fees paid and add transaction to history
      student.feesPaid += parseFloat(amount);
      student.feeTransactions = student.feeTransactions || [];
      student.feeTransactions.push(newTransaction);

      await student.save();

      res.status(200).json({
        error: false,
        student: student
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Internal server error"
      });
    }
  }

  static async addFeePayment(req, res) {
    try {
      const { id } = req.query;
      const { amount, date ,mode ,remarks} = req.body;

      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          error: true,
          message: "Student not found"
        });
      }

      // Add the new fee transaction
      const newTransaction = {
        amount: parseFloat(amount),
        date: new Date(date),
        mode: mode,
        remarks: remarks,
        createdAt: new Date()
      };

      // Update student's fees paid and add transaction to history
      student.feesPaid += parseFloat(amount);
      student.feeTransactions = student.feeTransactions || [];
      student.feeTransactions.push(newTransaction);

      await student.save();

      res.status(200).json({
        error: false,
        student: student,
        message: "Fee payment added successfully"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Internal server error"
      });
    }
  }


  static async updateBatches(req, res) {
    try {
      const { id } = req.params;
      const { batchName, startDate, endDate, courses } = req.body;

      const batch = await BatchModel.findByIdAndUpdate(id, {
        batchName,
        startDate,
        endDate,
        courses
      }, { new: true });

      res.status(200).json({
        error: false,
        message: "Batch updated successfully",
        batch
      });
    } catch (error) {
      console.error(error); 
      res.status(500).json({
        error: true,
        message: "Internal server error"
      });
    }
  }
}

export default Controller;
