import BatchModel from "../model/BatchModel.js";
import Batch from "../model/BatchModel.js";
import Student from "../model/StudentModel.js";
import 'dotenv/config'

class Controller {


  static async adminLogin(req,res) {
    try {
      const {username , password } = req.body
      if(process.env.ADMIN_USERNAME !==username){
       return res.status(400).json({
          error:true ,
          message:"username is incorrect",
          field:'username'
        })
      }

      if(process.env.ADMIN_PASSWORD !== password){
       return res.status(400).json({
           error : true ,
           message :"password is incorrect",
           field : "password"  
        })
      }

      res.status(200).json({
        error:false ,
        message :"admin logged in successfully !!"
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error when logging admin", error :true});
    }
  }

  static async createBatch(req, res) {
    try {
      console.log(req.body,'hdfjkasf')
      const { batchName, courses, startDate, endDate, instructor } = req.body;

      // Create a new batch
      const newBatch = new Batch({
        batchName,
        courses,
        startDate,
        endDate,
        instructor,
      });

      // Save to the database
      await newBatch.save();

      res.status(201).json({
        error:false,
        message: "Batch created successfully",
        batch: newBatch,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating batch", error :true});
    }
  }

  // Get all batches
  static async getAllBatches(req, res) {
    try {
      const batches = await Batch.find();
      res.status(200).json({
        error:false ,
        batches:batches
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving batches", error :true});
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
        error:false,
        students:batch.students
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving students", error:true });
    }
  }

  // Add a student to a batch
  static async addStudentToBatch(req, res) {
    try {
      const {data , certificates , photo } = req.body
      const { email ,phone ,batch} = data
      console.log(req.body)

      const sbatch = await BatchModel.findOne({_id:batch})

      if (!sbatch) {
        return res.status(404).json({ error : true ,message: "Batch not found" });
      }

      // Create the new student and associate it with the batch
      const newStudent = new Student({
        name: data.firstName + ' ' + data.lastName,
        email: data.email,
        mobile: data.mobile,
        rollNo: data.rollNo,
        enrollmentNo: data.enrollmentNo,  // Added enrollment number
        profileImage: photo,               // Added image
        certificates: certificates,   // Added certificate
        batch: sbatch._id,
      });
      
      // Save the student to the database
      await newStudent.save();

      // Add the student reference to the batch's students list
      sbatch.students.push(newStudent._id);
      await sbatch.save();

      res.status(201).json({
        error : false ,
        message: "Student added to batch successfully",
        student: newStudent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding student to batch", error : true });
    }
  }


  static async fetchStudents(req,res){
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
        error:false,
        students,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: true , message:"Error fetching students" });
    }
  }


  static async getStudentDetails(req,res) {
    try {
      const id = req.query.id
      const student = await Student.findOne({_id:id}).populate("batch");
      res.status(200).json({
        error:false,
        student : student
      })
    } catch (error) {
      console.log(error)     
      res.status(500).json({
        error:true ,
        message:"internal server error"
      }) 
    }
  }
}

export default Controller;
