import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from '../utils/sendMailer.js';

/* REGISTER USER */
export const register = async (req, res) => {
    try {

        console.log('Request Body:', req.body);

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        
        
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {expiresIn:"1d"});
    
        const url = `http://localhost:3000/verify-account/${savedUser._id}/verify/${token}`;
        await sendEmail(email,"Verify your email", url); // sends verification link to user's email
       // console.log("Email send Successfully !");
        res.status(201).json({status: true, message: `Account created successfully !An email sent to your account please verify !`, data:savedUser});
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, user.password);

        if(!user || !isMatch) return res.status(400).json({ message: "Email or password not match !" });

        
        //if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
        // Generate refresh token
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        user.refreshToken = refreshToken;
        await user.save();

        const accessToken = jwt.sign({ id: user._id, fullName: user.firstName + " " + user.lastName,
         roles: user.roles,  email : user.email, picturePath: user.picturePath, authSource: user.authSource, gender: user.gender }, process.env.JWT_SECRET, {expiresIn:"30m"});
        
     

        if(!user.verified) {
            const url = `http://localhost:3000/verify-account/${user._id}/verify/${accessToken}`;
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
                  background-color: #4e8098; /* A calming blue-grey */
                  color: #ffffff;
                  padding: 20px;
                  text-align: center;
                }
                .content img {
                  max-width: 100%;
                  height: auto;
                  border-bottom: 5px solid #4e8098; /* Matching the header */
                  display: block;
                  margin-bottom: 30px;
                }
                .content {
                  padding: 20px;
                  color: #333333;
                  text-align: center;
                }
                .content h2 {
                  color: #4e8098;
                  margin-bottom: 20px;
                }
                .content p {
                  line-height: 1.6;
                  margin-bottom: 15px;
                }
                .login-details {
                  background-color: #e8e8e8; /* A light grey for contrast */
                  border-left: 3px solid #4e8098;
                  padding: 15px;
                  margin: 25px 0;
                  display: inline-block;
                  transition: box-shadow 0.3s ease;

                }
                .login-details:hover {
                  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                }
                .footer {
                  background-color: #4e8098;
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
            
                  <p>Dear ${user.firstName + " " + user.lastName},</p>
                  <p>We are thrilled to welcome you to Elkindy, your new home for musical excellence. At Elkindy, we embrace the diversity of age, experience, and nationality, providing a vibrant community where music education is both accessible and exceptional.</p>
                  <div class="login-details" style="width: 90%;">
                    <h4><strong>Please verify your email:</strong></h4>
                    <a href="${url}" style="display: inline-block; background-color: #4e8098; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
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
            await sendEmail(email,"Verify your emaill", body); // sends verification link to user's email
            console.log("Email send Successfullyyyyyyyy !");
            return res.status(401).json({status: false, message: "An email sent to your account ! please verify !"});
        }

        delete user.password;
        res.status(200).json({ accessToken, refreshToken: user.refreshToken });
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });
        
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Check expiration date of refresh token
       

        const accessToken = jwt.sign({ id: user._id, fullName: user.firstName + " " + user.lastName,

        roles: user.roles,  email : user.email, picturePath : user.picturePath  }, process.env.JWT_SECRET, { expiresIn: "30s" });

        res.json({ accessToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log("JWT expired:", error.message);
            return res.status(401).json({ message: "JWT expired" });
        } else {
            console.log("Error:", error.message);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    
    }
};

export const verifyAccount = async (req, res) => {
    try{
        const {id } = req.params;
        const user = await User.findOne({_id: id});
        if(!user) {
            return res.status(404).json({status: false, message: "User not existed !"});
        }
        if(user.verified) {
            return res.status(400).json({status: false, message: "This account has already been verified!"})
        }
        const updatedUser = await User.findByIdAndUpdate({_id: id}, {verified: true});
        if(!updatedUser)  {
            res.status(400).json({status : "Failed", msg :"Failed To verify account"})  
        } 
        res.status(200).json({status : "Success",message: "The account has been verified" })
        
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
}


export const forgetPassord = async (req, res) => {
    const {
        email
    } = req.body;
    const user = await User.findOne({email: email});
    
    if(!user) {
        return res.status(404).json({status: false, message: "User not existed !"});
    }
    else{
    console.log("email : ", email)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn:"5m"});
    
    const url = `http://localhost:3000/reset-password/${user._id}/${token}`;
    await sendEmail(email, "Reset your password", url);
    res.status(200).json({status : "Success" })
    }     
}

export const resetPassord = async (req, res) => {
        const {id } = req.params;
        const { password} = req.body;
        
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
            
        const updatedUser = await User.findByIdAndUpdate({_id: id}, {password: passwordHash});
        if(!updatedUser)  {
           return res.status(400).json({status : "Failed", message :"Failed To Update Password"})  
        } 
        res.status(200).json({status : "Success" })

    }
                


/* Get All */
 export const getAllUsers = async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json({users});
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
 
}
// Get a User
export const getUser = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await User.findById(id);
      if (user) {
        const { password, ...otherDetails } = user._doc;
  
        res.status(200).json(otherDetails);
      } else {
        res.status(404).json("No such User");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };
//Get all User by Role
export const getAllUserByRole = async (req, res) => {
    const role = req.params.role;
    try {
        const users = await User.find({roles: role});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};


//planning
export const getTeachers = async (req, res) => {
  try {
      const teachers = await User.find({ roles: 'teacher' });
      res.status(200).json(teachers);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Fonction pour récupérer tous les étudiants
export const getStudents = async (req, res) => {
  try {
      const students = await User.find({ roles: 'student' });
      res.status(200).json(students);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

