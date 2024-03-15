import mongoose from "mongoose";

const planningSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  color: {
    type: String, 
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', 
  },
  // Modifier pour référencer le modèle User pour les enseignants
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assurez-vous que ceci correspond à votre modèle d'utilisateur
  },
  // Modifier pour référencer le modèle User pour les étudiants
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assurez-vous que ceci correspond à votre modèle d'utilisateur
  },
});

const Planning = mongoose.model("Planning", planningSchema);

export default Planning;
