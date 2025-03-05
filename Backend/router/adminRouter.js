import { Router } from 'express'
const router = Router()
import controller from '../controller/Controller.js'


router.post("/adminLogin",controller.adminLogin)
router.post("/addStudentToBatch",controller.addStudentToBatch)
router.post("/createBatch",controller.createBatch)



router.get("/getStudentsInBatch",controller.getStudentsInBatch)
router.get("/getAllBatches",controller.getAllBatches)


export default router   