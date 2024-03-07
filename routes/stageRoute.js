import express from "express";
const router = express.Router();
import {
  createStage,
  getStages,
  getStage,
  updateStage,
  deleteStage,
} from "../controllers/stageController.js";

router.get("/", getStages);
router.get("/:id", getStage);
router.patch("/:id", updateStage);
router.delete("/:id", deleteStage);

export default router;
