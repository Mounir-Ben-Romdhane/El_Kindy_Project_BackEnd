import express from "express";
import { getAll, addInscription, getInscriptionById, removeInscription, approveInscription, rejectInscription } from '../controllers/inscriptionController.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/all",verifyToken, getAll);
router.post("/add", addInscription);
router.delete("/delete/:id",verifyToken, removeInscription);
router.get("/:id",verifyToken, getInscriptionById);
// Route for approving inscription
router.patch('/:id/approve',verifyToken, approveInscription);

// Route for rejecting inscription
router.patch('/:id/reject',verifyToken,  rejectInscription);


export default router;