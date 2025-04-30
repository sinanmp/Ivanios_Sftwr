import express from 'express';
import Controller from '../controller/Controller.js';

const router = express.Router();

// Admin routes
router.post("/adminLogin", Controller.adminLogin);
router.post("/addStudentToBatch", Controller.addStudentToBatch);
router.post("/createBatch", Controller.createBatch);
router.get("/getStudentsInBatch", Controller.getStudentsInBatch);
router.get("/getAllBatches", Controller.getAllBatches);
router.get("/fetchStudents", Controller.fetchStudents);
router.get("/getStudentDetails", Controller.getStudentDetails);
router.delete("/deleteStudent", Controller.deleteStudent);
router.get("/getBatchDetails", Controller.getBatchDetails);
router.get("/getCourses", Controller.getCourses);
router.post("/addCourse", Controller.addCourse);
router.delete("/deleteCourse/:id", Controller.deleteCourse);
router.put("/updateCourse/:id", Controller.updateCourse);
router.put("/updateStudent", Controller.updateStudent);
router.get("/getCourseDetails", Controller.getCourseDetails);
router.post("/addStudent", Controller.addStudent);
router.post("/addFeePayment", Controller.addFeePayment);
router.post("/checkExistingStudent", Controller.checkExistingStudent);
export default router;   