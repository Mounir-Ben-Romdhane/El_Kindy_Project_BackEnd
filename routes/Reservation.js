import express from 'express';
import { createReservation, listReservationsByid,listReservations,updateReservationStatus, deleteReservation   } from '../controllers/reservationController.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

router.post("/:eventId/reservation", createReservation);
router.get("/reservationFront/:eventId", listReservationsByid);
router.get("/reservationsFront", listReservations);
router.get("/reservation/:eventId",verifyToken, listReservationsByid);
router.get("/reservations",verifyToken, listReservations);
router.patch('/reservations/:reservationId',verifyToken, updateReservationStatus);
router.delete('/reservation/delete/:reservationId', verifyToken, deleteReservation);



export default router;