import { Router } from 'express'
const router = Router()
import controller from '../controller/Controller.js'


router.post("/adminLogin",controller.adminLogin)
router.post("/addStudentToBatch",controller.addStudentToBatch)
router.post("/createBatch",controller.createBatch)



router.get("/getStudentsInBatch",controller.getStudentsInBatch)
router.get("/getAllBatches",controller.getAllBatches)
router.get("/fetchStudents",controller.fetchStudents)
router.get("/getStudentDetails",controller.getStudentDetails)


export default router   