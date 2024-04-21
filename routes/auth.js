import express from "express";
import { login, register,refreshToken, getAllUsers, forgetPassord, resetPassord, verifyAccount,getUser,getAllUserByRole, getTeachers, getStudents, getUserById, getTeacherById } from "../controllers/auth.js"

import { verifyToken } from '../middleware/auth.js';
import googleAuth from "../controllers/googleAuth.js";
import { facebooklogin } from "../controllers/passport-facebook.js";
import { addAdmin, addStudentAndParent, addTeacher, blockUser, removeUser, unblockUser, updateStudent, updateTeacher, updateUser } from "../controllers/users.js";




const router = express.Router();
router.get('/teachers', getTeachers);

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
router.get('/getAllUserByRole/:role',getAllUserByRole);
router.get('/getTeacher/:teacherId', getTeacherById);


//Add users
router.post("/addAdmin", addAdmin);
router.post("/addTeacher", addTeacher);
router.post("/addStudentAndParent", addStudentAndParent);

// Remove user
router.delete("/removeUser/:userId", removeUser);

//get user
router.get("/userById/:id", getUserById);

// Update user
router.put("/updateAdmin/:userId", updateUser);
router.put("/updateTeacher/:teacherId", updateTeacher);
router.put("/updateStudent/:studentId", updateStudent);

// blockUser and unblockUser
router.put("/blockUser/:userId", blockUser);
router.put("/unblockUser/:userId", unblockUser);



export default router;