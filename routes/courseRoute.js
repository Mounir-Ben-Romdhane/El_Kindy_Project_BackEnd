import express from "express";
import { getAll, removeCourse, getCourseById, getAllCoursesGroupedByCategory } from "../controllers/courseController.js";
import { verifyToken, verifyRoles } from "../middleware/auth.js";

const router = express.Router();

//router.get("/all", verifyToken, verifyRoles(["superAdmin", "admin", "teacher"]), getAll);
//router.get("/all", getAll);
router.get("/all", verifyToken, getAll);
router.get("/getAllByCategories", getAllCoursesGroupedByCategory)
router.delete("/delete/:id", removeCourse);
router.get("/:id", verifyToken, getCourseById);

export default router;