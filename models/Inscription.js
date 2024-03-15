import mongoose from "mongoose";

const inscriptionSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  niveauEtude: {
    type: String,
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  parentProfession: {
    type: String,
    required: true
  },
  phoneNumber1: {
    type: String,
    required: true
  },
  phoneNumber2: {
    type: String
  },
  likedCourses: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    default: []
  },
  disponibilite: {
    type: Array,
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'refused'],
    default: 'pending'
  }
});

const Inscription = mongoose.model('Inscription', inscriptionSchema);

export default Inscription;
