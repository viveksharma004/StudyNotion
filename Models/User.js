const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        trim:true,
    },
    lastName:{
        type:String,
        required: true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required: true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Profile",
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
    }],
    image:{
        type:String,
        required:true,
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
    }],
    //this token is for the forgot password token used to validate the resetting of the password
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    }
})

module.exports=mongoose.model("User",UserSchema);