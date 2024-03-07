import express from "express";
import { verifyToken, verifyRoles } from "../middleware/auth.js";
import { createCategorie, getAllCategories, updateCategorie, deleteCategorie, getCategorieById } from "../controllers/categorieController.js";

const router = express.Router();

//router.get("/",verifyToken, getAllCategories);
router.get("/", getAllCategories);
router.put("/:id", updateCategorie);
router.delete("/:id", deleteCategorie);
router.get("/:id", getCategorieById);

export default router;
