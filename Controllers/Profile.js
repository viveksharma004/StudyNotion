const Profile=require("../Models/Profile")


exports.updateProfile=async (req,res)=>{
    try{
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        const userId=req.user.id;
        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"Contact Number and gender are required"
            })
        }
        //find user
        const userDetails=await User.findById(userId);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);

        //updating the profile
        profileDetails.about=about;
        profileDetails.contactNumber=contactNumber;
        profileDetails.gender=gender;
        profileDetails.dateOfBirth=dateOfBirth;
        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:"Updated the profile of the user",
            profileDetails:profileDetails,
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Could not update the profile Information",
            error:err.message
        })
    }
}


//delete account 
//scheduling the delete request
//cron job
exports.deleteAccount=async(req,res)=>{
    try{
        const {userId}=req.user.id;
        if(!userId){
            return res.status(500).json({
                success:false,
                message:"Could not delete the account"
            })
        }
        const userDetails=await User.findById(userId);
        if(!userDetails){
            return res.status(500).json({
                success:false,
                message:"User not found"
            })
        }

        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //unenroll the user from all the enrolled courses

        await User.findByIdAndDelete({_id:userId});
        return res.status(200).json({
            success:true,
            message:"User Account deleted successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Could not delete the user account",
            error:err.message
        })
    }
}

//get all user details
exports.getAllUserDetails=async(req,res)=>{
    try{
        const id=req.user.id;
        const userDetails=await User.findById(id).populate("additionalDetails").exec();
        userDetails.password=null;
        userDetails.token=null;
        return res.status(200).json({
            success:true,
            message:"User Details fetched successfully",
            data:userDetails,
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Could not fetch all  user details",
            error:err.message
        })
    }
}