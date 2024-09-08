const mongoose=require("mongoose");


const ProfileSchema=new mongoose.Schema({
    gender:{
        type: String,
    },
    dateOfBirth:{
        type: String,
    },
    about:{
        type:String,
    },
    contactNumber:{
        type: Number,
    }
})

module.exports=mongoose.model("Profile",ProfileSchema);