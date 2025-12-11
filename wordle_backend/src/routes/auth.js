import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middlewares/auth_middleware.js';

const router = express.Router();

//Generate JWT
const GenerateToken = (userId) => {
  console.log("JWT_SECRET =", process.env.JWT_SECRET); // optional debug
  return jwt.sign(
    { userId },                     // payload
    process.env.JWT_SECRET,         // secret
    { expiresIn: "7d" }             // options
  );
};



//Signup Route
router.post('/signup' ,async(req,res) => {
    try{
    const { username , email , password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({error : "All fields are required"});
    }

    //checking if user already exists
    const existingUser = await User.findOne({
        $or : [{ username} , {email}]
    });

    if(existingUser){
        return res.status(400).json({error : "User already exists"});
    }

    const user = await User.create({username,email,password});

    const token = GenerateToken(user._id);

    const sanitizedUser = {
        _id : user._id,
        username : user.username,
        email : user.email
    };

    return res.status(201).json({
        "message": "Signup successful",
        user : sanitizedUser,
        token
    });
    }
    catch(err){
        console.log("Signup unsuccessful",err);
        return res.status(500).json({error : "server error during signup"});
    }
});

//login route
router.post("/login" , async (req,res) => {
    try{
        const { email , password } = req.body;

    if(!email || !password){
        return res.status(400).json({error : "Missing credentials"});
    }

    //checking if user exists
    const user = await User.findOne({ email});

    if(!user){
        return res.status(400).json({error : "User does not exist"});
    }

    //compare password
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({error : "wrong password"});
    }

    const token = GenerateToken(user._id);

    //sanitized user
    const sanitizedUser = {
        _id : user._id,
        name : user.username,
        email : user.email,
    }

    return res.status(200).json({
        message : "login successfull",
        user: sanitizedUser,
        token
    });
}catch(err){
    console.log("Login failed",err);
    return res.status(500).json({error : "server error during login"});
}
});

export default router;

