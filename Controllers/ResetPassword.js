const User =require("../Models/User")
const mailSender=require("../Utils/mailSender")


//reset password Token
exports.resetPassword=async(req,res)=>{
    try{
        //get email from body
        const email=req.body.email;
        if(!email){
            return res.status(401).json({
                success:false,
                message:"Email required"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not registered with us",
            })
        }
        //generate token
        const token=crypto.randomUUID();

        // add token to user database and its expiry time
        const updatedDetails=await User.findOne({email:email},{
            token:token,
            resetPasswordExpires: Date.now()+5*60*1000,
        },{new:true});

        //create Url
        const url=`https://localhost:3000/update-password/${toke}`;

        //send mail containing url 
        await mailSender(email,"Password Reset Link ",`Password Reset Link${url}`);
        return res.status(200).json({
            success:true,
            message:"Email Sent successfully, please check your email",
        })
    }
    catch(e){
        return res.status().json({

        })
    }
}

// reset password
exports.resetPassword=async(req,res)=>{
    try{
        //data fetch
    const {password,confirmPassword,token} = req.body;
    //validation
    if(password!==confirmPassword){
        return res.status(401).json({
            success:false,
            message:"Password not matched",
        })
    }
    //get user details from token 
    const userDetails=await User.findOne({token:token});
    //no entry of token in db
    if(!userDetails){
        return res.status(404).json({
            success:false,
            message:"Token is invalid",
        })
    }
    //token time 
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.status(404).json({
            success:false,
            message:"Token is expired, regenerate token again",
        })
    }
    //password hashing 
    const hashedPassword=await bcrypt.hash(password,10);
    //update password
    await User.findOne({token:token},{
        password:hashedPassword,
    },{new:true})
    //res return
    return res.status(200).json({
        success:true,
        message:"Password reset successfully",
    }
)
    }catch(err){
        return res.status(500).json({
            success:false,message:"Could not reset password",
        })
    }

}