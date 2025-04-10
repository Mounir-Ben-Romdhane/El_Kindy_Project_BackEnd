import express from "express";


import { login, register,refreshToken, getAllUsers, forgetPassord, resetPassord, verifyAccount,getUser,getAllUserByRole, getCoursesTaughtByTeacher,getCoursesByStudent,getAssignmentsByCourseIdForStudent,getCoursesByStudentId,getClassByStudent,getStudentsInClassByCourseAndClass,getCoursesTaughtByTeacherInClass,
 getStudents, getUserById, getTeacherById,getClassesTaughtByTeacher,getStudentsEnrolledInClass , getStudentById, 
 getTeachers,
 getClassesAndStudentsNotEnrolledInClassByCourseAndTeacher} from "../controllers/auth.js"



import { verifyToken } from '../middleware/auth.js';
import googleAuth from "../controllers/googleAuth.js";
import { facebooklogin } from "../controllers/passport-facebook.js";
import { addAdmin, addStudentAndParent, addTeacher, ajouter2FA, blockUser, getDispo, removeUser, unblockUser, updateEmail, updatePassword, updateStudent, updateTeacher, updateTimeSlots, updateUser } from "../controllers/users.js";




const router = express.Router();
router.get('/teachers', getTeachers);
router.get('/course/:studentId', getCoursesByStudentId);
router.get('/students/:studentId', getStudentById);

router.get("/assignments/:courseId/:studentId", getAssignmentsByCourseIdForStudent);

// Route pour récupérer tous les étudiants
router.get('/students', getStudents);
router.get('/:id',verifyToken, getUser);

router.post("/register",register);
router.post("/login", login);
router.post("/refresh-token", refreshToken); // New route for refresh token
router.post("/forgot-password", forgetPassord);
router.post("/reset-password/:id",verifyToken, resetPassord);
router.get("/verify-account/:id/verify",verifyToken,verifyAccount);
router.post("/facebooklogin", facebooklogin); 
router.get('/getAll', verifyToken,getAllUsers);
router.post("/googleAuth", googleAuth);
router.get('/getAllUserByRole/:role', verifyToken, getAllUserByRole);
router.get('/getTeacher/:teacherId', getTeacherById);
router.get('/getClassesTaughtByTeacher/:teacherId', getClassesTaughtByTeacher);
router.get('/getStudentsEnrolledInClass/:classId', getStudentsEnrolledInClass);
router.get('/getCoursesTaughtByTeacherInClass/:teacherId/:classId', getCoursesTaughtByTeacherInClass);
router.get('/getStudentsInClassByCourseAndClass/:classId/:courseId', getStudentsInClassByCourseAndClass);
router.get('/getClassByStudent/:studentId', getClassByStudent);
router.get('/getCoursesByStudent/:studentId', getCoursesByStudent);
router.get('/getCoursesTaughtByTeacher/:teacherId', getCoursesTaughtByTeacher);
router.get('/getClassesAndStudentsNotEnrolledInClassByCourseAndTeacher/:courseId/:teacherId', getClassesAndStudentsNotEnrolledInClassByCourseAndTeacher);
//Add users
router.post("/addAdmin",verifyToken, addAdmin);
router.post("/addTeacher",verifyToken, addTeacher);
router.post("/addStudentAndParent",verifyToken, addStudentAndParent);

// Remove user
router.delete("/removeUser/:userId",verifyToken, removeUser);

//get user
router.get("/userById/:id",verifyToken, getUserById);

//get disponibilite
router.get( "/teacher/disponibility" , getDispo );

// Update user
router.put("/updateAdmin/:userId",verifyToken, updateUser);
router.put("/updateTeacher/:teacherId",verifyToken, updateTeacher);
router.put("/updateStudent/:studentId",verifyToken, updateStudent);

// blockUser and unblockUser
router.put("/blockUser/:userId",verifyToken, blockUser);
router.put("/unblockUser/:userId",verifyToken, unblockUser);

//update user email
// Assuming you have a route like this in your Express router
router.put('/updateEmail/:id', verifyToken, updateEmail);
router.put('/updatePassword/:id', verifyToken, updatePassword);
router.put('/updateTimeSlots/:id', verifyToken, updateTimeSlots);
router.post('/ajouter2FA/:email',verifyToken, ajouter2FA);



export default router;