import express from 'express';
import { create,list,update,remove,getContactById} from "../controllers/ContactUsController.js";
import { verifyToken, verifyRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/",create);
router.get("/get",verifyToken,list);
router.put("/:id",update);
router.delete("/:id",verifyToken,remove);
router.get("/:id",getContactById);

export default router;