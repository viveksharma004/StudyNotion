const mongoose=require("mongoose")


const rrSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,    
        required: true,
        ref:"User",
    },
    rating:{
        type:Number,
        required: true,
    },
    review:{
        type:String,
        required: true,
    }
});

module.exports = mongoose.model("RatingAndReview",rrSchema);