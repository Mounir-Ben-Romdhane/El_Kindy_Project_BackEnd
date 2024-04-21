import Reservation from "../models/Reservation.js";
import Event from "../models/Event.js";
import { sendSms } from "../index.js"
import axios from 'axios';
import { generateInvoice } from './Pdf.js';





export const createReservation = async (req, res) => {
  console.log("Initiating reservation:", req.params, req.body);
  const { eventId } = req.params;
  const { userName, userEmail, phoneNumber } = req.body;

  try {
    const eventDetails = await Event.findById(eventId);
    if (!eventDetails) {
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("Event price:", eventDetails.price);

    if (!eventDetails.price) {
      const newReservation = new Reservation({ eventId, userName, userEmail, phoneNumber });
      const savedReservation = await newReservation.save();
      return res.status(201).json({ reservation: savedReservation });
    }

    const amountinMillimes = eventDetails.price * 1000;
    const paymentPayload = { amount: amountinMillimes };

    axios.post('http://localhost:3001/payment/payment', paymentPayload)
      .then(paymentResponse => {
        console.log("Payment link generated:", paymentResponse.data.result.developer_tracking_id);
        res.redirect(paymentResponse.data.result.link);
      })
      .catch(paymentError => {
        console.error("Payment link generation failed:", paymentError);
        res.status(500).json({ message: "Error generating payment link", error: paymentError.message });
      });
  } catch (error) {
    console.error("Failed to create reservation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}





export const listReservationsByid = async (req, res) => {
  const { eventId } = req.params;
  try{
    const reservation = await Reservation.find({ eventId });
    res.json(reservation);
  }catch{
    res.status(500).send({ message: "Error fetching reservation", error: error.message });
  }
}

// Get All Events
export const listReservations = async (req, res) => {
 try{
  let reservations = await Reservation.find({}).populate('eventId');
  console.log(JSON.stringify(reservations, null, 2));
  res.json(reservations);
 }catch (err) {
  console.error(err);
  res
    .status(500)
    .json({
      error: "Internal Server Error",
      message: "Could not retrieve events",
    });
}
}


export const updateReservationStatus = async (req, res) => {
  const { reservationId } = req.params;
  const { status } = req.body;

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true } // This option returns the document as it looks after update was applied.
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    if (status === 'accepted') {
      // Fetch event details here
      const eventDetails = await Event.findById(updatedReservation.eventId);
      if (!eventDetails) {
        return res.status(404).json({ message: "Event not found" });
      }

      
      sendSms(updatedReservation.phoneNumber).then(() => {
          console.log("SMS notification sent.");
      }).catch(err => {
          console.error("Failed to send SMS notification:", err);
      });

      generateInvoice({
        eventName: eventDetails.name,
        eventDate: eventDetails.date.toString(),
        userName: updatedReservation.userName,
        userEmail: updatedReservation.userEmail,
        price: eventDetails.price
      }).then(filePath => {
        // Assuming sendInvoiceEmail function is properly defined elsewhere or imported
        sendInvoiceEmail(updatedReservation.userEmail, filePath)
          .then(() => console.log("Invoice emailed successfully."))
          .catch(err => console.error("Error sending invoice email:", err));
      }).catch(err => console.error("Error generating invoice:", err)); 
    }


    res.json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation status:", error);
    res.status(500).json({ message: "Error updating reservation status", error: error.message });
  }
};



