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
        const { firstName, lastName, gender, dateOfBirth, email, city, niveauEtude, parentName, parentProfession, phoneNumber1, phoneNumber2, likedCourses, disponibilite } = req.body;

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
            likedCourses,
            disponibilite
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

        const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Elkindy</title>
  <style>
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border: 1px solid #cccccc;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #4CAF50; /* Green color for the header */
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content img {
      max-width: 100%;
      height: auto;
      border-bottom: 5px solid #4CAF50; /* Matching the header */
      display: block;
      margin-bottom: 30px;
    }
    .content {
      padding: 20px;
      color: #333333;
      text-align: center;
    }
    .content h2 {
      color: #4CAF50; /* Green color for the headings */
      margin-bottom: 20px;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .login-details {
      background-color: #E8F5E9; /* Light green for success */
      border-left: 3px solid #4CAF50; /* Green border for success */
      padding: 15px;
      margin: 25px 0;
      display: inline-block;
      transition: box-shadow 0.3s ease;
    }
    .login-details:hover {
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .footer {
      background-color: #4CAF50; /* Green color for the footer */
      color: #ffffff;
      text-align: center;
      padding: 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      <!-- Replace 'your-image-url.jpg' with the actual URL of your image -->
      <img class="image-with-border" src="https://i.imgur.com/4qQS8E2.jpeg" alt="Conservatory Scene">

      <p>Dear ${inscription.firstName + " " + inscription.lastName},</p>
      <p>We are pleased to inform you that your preinscription has been approved. Welcome to Elkindy, your new home for musical excellence!</p>
      <div class="login-details" style="width: 90%;">
        <h4><strong>Your Account Details:</strong></h4>
        <p><strong>Email:</strong> ${inscription.email}</p>
        <p><strong>Password:</strong> ${randomPassword}</p>
      </div>
      <p>We encourage you to log in promptly and start exploring the various resources available to you. Remember, the realm of music is vast, and every lesson is a step towards mastery. We are excited to see where this musical voyage will take you.</p>
      <p>Welcome aboard,</p>
      <p><strong>The Elkindy Team</strong></p>
    </div>
    <div class="footer">
      © 2024 Elkindy. All rights reserved.
    </div>
  </div>
</body>
</html>`;

        await sendEmail(inscription.email,"Resultat inscription", body); 
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
        const body =`<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Elkindy</title>
              <style>
                @keyframes fadeIn {
                  0% { opacity: 0; }
                  100% { opacity: 1; }
                }
                body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f7f7f7;
                  margin: 0;
                  padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: auto;
                    background: #ffffff;
                    border: 1px solid #cccccc;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                  }
                  
                  .header {
                    background-color: #ff6347; /* Coral color for the header */
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                  }
                  
                  .content img {
                    max-width: 100%;
                    height: auto;
                    border-bottom: 5px solid #ff6347; /* Matching the header */
                    display: block;
                    margin-bottom: 30px;
                  }
                  
                  .content {
                    padding: 20px;
                    color: #333333;
                    text-align: center;
                  }
                  
                  .content h2 {
                    color: #ff6347; /* Coral color for the headings */
                    margin-bottom: 20px;
                  }
                  
                  .content p {
                    line-height: 1.6;
                    margin-bottom: 15px;
                  }
                  
                  .login-details {
                    background-color: #f8d7da; /* Light red for error */
                    border-left: 3px solid #dc3545; /* Red border for error */
                    padding: 15px;
                    margin: 25px 0;
                    display: inline-block;
                    transition: box-shadow 0.3s ease;
                  }
                  
                  .login-details:hover {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                  }
                  
                  .footer {
                    background-color: #ff6347; /* Coral color for the footer */
                    color: #ffffff;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                  }
                  
                /* Additional styles if necessary */
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="content">
                  <!-- Replace 'your-image-url.jpg' with the actual URL of your image -->
                  <img class="image-with-border" src="https://i.imgur.com/4qQS8E2.jpeg" alt="Conservatory Scene">
            
                  <p>Dear ${inscription.firstName + " " + inscription.lastName},</p>
                  <p>We are thrilled to welcome you to Elkindy, your new home for musical excellence. At Elkindy, we embrace the diversity of age, experience, and nationality, providing a vibrant community where music education is both accessible and exceptional.</p>
                  <div class="login-details" style="width: 90%;">
                  <p>We regret to inform you that your inscription has been rejected due to incorrect information provided. If you believe there has been a mistake, please contact our administration team for further assistance.</p>
                    </div>
                  <p>We encourage you to log in promptly and start exploring the various resources available to you. Remember, the realm of music is vast, and every lesson is a step towards mastery. We are excited to see where this musical voyage will take you.</p>
                  <p>Welcome aboard,</p>
                  <p><strong>The Elkindy Team</strong></p>
                </div>
                <div class="footer">
                  © 2024 Elkindy. All rights reserved.
                </div>
              </div>
            </body>
        </html>`;
        await sendEmail(inscription.email,"Resultat inscription", body);
        res.status(200).json(inscription);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
