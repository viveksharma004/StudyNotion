const mongoose=require("mongoose");

exports.dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL,{
    })
    .then(()=>{
        console.log("DB connected successfully");
    })
    .catch((err)=>{
        console.log("BD connection Failed");
        console.log(err);
        process.exit(1);
    })
};