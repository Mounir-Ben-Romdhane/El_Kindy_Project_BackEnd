import express from 'express';
    import { createReservation, listReservationsByid,listReservations,updateReservationStatus,deleteReservation} from '../controllers/ReservationStageController.js';
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

router.post("/:stageId/reservation", createReservation);
router.get("/reservation/:stageId", listReservationsByid);
router.get("/reservations",verifyToken, listReservations);
router.put('/updateReservationStatus/:reservationstageId', verifyToken,updateReservationStatus);
router.delete('/deleteReservation/:reservationstageId', verifyToken,deleteReservation);

export default router;