import BatchModel from "../model/BatchModel.js";
import Batch from "../model/BatchModel.js";
import Course from "../model/Course.model.js";
import Student from "../model/StudentModel.js";
import 'dotenv/config';

class Controller {


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
        name: { $regex: search, $options: 'i' }, // For searching
      })
        .skip((page - 1) * limit) // Pagination logic
        .limit(parseInt(limit)); // Number of students per page

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
      console.log(err)
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
      console.log(error)
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
        .populate('students', 'name email enrollmentNo admissionNo');

      if (!batch) {
        return res.status(404).json({
          error: true,
          message: "Batch not found"
        });
      }

      res.status(200).json({
        error: false,
        message: "Batch fetched successfully",
        data: batch
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
      console.log(result ,"this is result")
      res.status(200).json({
        error:false,
        message:"courses fetched successfully",
        data:result
      })
    } catch (error) {
      console.log(error)
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
      
      // Find and delete the student
      const student = await Student.findByIdAndDelete(id);
      
      if (!student) {
        return res.status(404).json({
          error: true,
          message: "Student not found"
        });
      }

      // Remove student reference from the batch
      if (student.batch) {
        await BatchModel.findByIdAndUpdate(
          student.batch,
          { $pull: { students: id } }
        );
      }

      res.status(200).json({
        error: false,
        message: "Student deleted successfully"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Error deleting student"
      });
    }
  }
}

export default Controller;
