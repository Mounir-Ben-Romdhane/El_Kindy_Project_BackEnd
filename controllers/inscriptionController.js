import Inscription from '../models/Inscription.js';
import { sendEmail } from '../utils/sendMailer.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; ++i) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

export const getAll = async (req, res) => {
    try {
        let data = await Inscription.find().populate("likedCourses");
        //let data = await Inscription.find();
        if (!data || !data.length) throw 'No inscriptions found!';
        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

export const addInscription = async (req, res) => {
    try {
        console.log("Body : ",req.body);
        const { firstName, lastName, gender, dateOfBirth, email, city, niveauEtude, parentName, parentProfession, phoneNumber1, phoneNumber2, likedCourses } = req.body;

        const newInscription = new Inscription({
            firstName,
            lastName,
            gender,
            dateOfBirth,
            email,
            city,
            niveauEtude,
            parentName,
            parentProfession,
            phoneNumber1,
            phoneNumber2,
            likedCourses
        });

        const savedInscription = await newInscription.save();

        return res.status(201).json({
            success: true,
            id: savedInscription._id,
            message: "Inscription added successfully!"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};


export const removeInscription = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedInscription = await Inscription.findByIdAndDelete(id);
        if (!deletedInscription) {
            return res.status(404).json({ success: false, error: "Inscription not found." });
        }

        return res.status(200).json({ success: true, message: "Inscription deleted successfully." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

export const getInscriptionById = async (req, res) => {
    const { id } = req.params;

    try {
        const inscription = await Inscription.findById(id).populate("likedCourses");
        if (!inscription) {
            return res.status(404).json({ message: "Inscription not found" });
        }
        res.status(200).json(inscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Method to approve inscription
export const approveInscription = async (req, res) => {
    try {
        const inscription = await Inscription.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
        // Example usage: Generate a random password of length 10
        const randomPassword = generateRandomPassword(10);
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        const newUser = new User({
            firstName: inscription.firstName,
            lastName: inscription.lastName,
            email: inscription.email,
            password: passwordHash,
            verified: true
        });
        
        
        await newUser.save();
        const message = `Compte info :
        gmail : ${inscription.email} 
        password : ${randomPassword}`;
        await sendEmail(inscription.email,"Resultat inscription", message); 
        res.status(200).json(inscription);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Method to reject inscription
export const rejectInscription = async (req, res) => {
    try {
        const inscription = await Inscription.findByIdAndUpdate(req.params.id, { status: 'refused' }, { new: true });
        await sendEmail(inscription.email,"Resultat inscription", "Inscription refused");
        res.status(200).json(inscription);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
