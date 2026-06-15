const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

exports.login=async(req,res)=>{

    try{
        const {email , password}= req.body;
        const user= await User.findOne({email});

        try{
            if(!email || !password){
                return res.status(400).json({message:"please provide email and password"})
            }
        }
        catch(error){
            return res.status(400).json({message:error.message})
        }
        
        if(!user){
            return res.status(400).json({ message:"invalide credentials"})
        };

        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:" the password is not matching "})
        }
        // create token

        const token=jwt.sign({
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
        )

        res.json({
        message:"login successfull",
        token,
        user:{
            id:user._id,
            username:user.username,
            role:user.role,
        },
        });
        



    }
    catch(error){
        return res.status(500).json({message:error.message})
        
    }

}
