import express from "express";
import { addNewPlanning , getAllPlannings , getPlanningsForTeacher , getPlanningsForStudent } from "../controllers/planningController.js";

const router = express.Router();

// Route pour ajouter un nouvel événement
router.post("/add", addNewPlanning);
router.get("/all" , getAllPlannings);
router.get("/teacher/:teacherId", getPlanningsForTeacher);
router.get("/student/:studentId", getPlanningsForStudent);

export default router;