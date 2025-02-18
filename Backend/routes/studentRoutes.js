import express from 'express';
import { 
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} from '../controllers/studentController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// All routes are protected with admin authentication
router.use(isAdminAuthenticated);

router.route('/')
    .get(getAllStudents)
    .post(createStudent);

router.route('/:id')
    .get(getStudentById)
    .put(updateStudent)
    .delete(deleteStudent);

export default router; 