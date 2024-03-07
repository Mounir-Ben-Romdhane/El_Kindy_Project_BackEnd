import express from "express";
import { getAll, addInscription, getInscriptionById, removeInscription, approveInscription, rejectInscription } from '../controllers/inscriptionController.js';

const router = express.Router();

router.get("/all", getAll);
router.post("/add", addInscription)
router.delete("/delete/:id", removeInscription);
router.get("/:id", getInscriptionById);
// Route for approving inscription
router.patch('/:id/approve', approveInscription);

// Route for rejecting inscription
router.patch('/:id/reject', rejectInscription);


export default router;