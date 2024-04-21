import express from 'express';
import { Add, Verify} from '../controllers/paymentController.js';
const router = express.Router();

router.post("/payment", Add);
router.post("/payment/:id", Verify);
/* router.post("/payment/reservation", AddReservation); */

export default router
