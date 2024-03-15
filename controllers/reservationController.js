import Reservation from "../models/Reservation.js";
import Event from "../models/Event.js";
import { sendSms } from "../index.js"

export const createReservation = async (req, res) => {
  console.log("createReservation hit", req.params, req.body); 
  const { eventId } = req.params;
  const { userName, userEmail, phoneNumber } = req.body;

  try{
    const newReservation = new Reservation({
      eventId,
      userName,
      userEmail,
      phoneNumber,
    })

    const saveReservation =await newReservation.save();
    res.status(201).json(saveReservation);
  }
  catch (error) {
    res.status(500).send({ message: "Error creating reservation", error: error.message });
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
      sendSms(updatedReservation.phoneNumber).then(() => {
          console.log("SMS notification sent.");
      }).catch(err => {
          console.error("Failed to send SMS notification:", err);
      });
  }

    res.json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation status:", error);
    res.status(500).json({ message: "Error updating reservation status", error: error.message });
  }
};

