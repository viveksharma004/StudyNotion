const Category=require("../Models/Category");

// create tag handler
exports.createCategory=async(req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name || !description) return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
        const categoryDetails=await Category.create({name:name,description:description});
        console.log(categoryDetails);

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


//get all tags
exports.showAllCategory=async(req,res)=>{
    try{
        const allCategories=await Category.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message:"All tags got in all tags",
            allCategories,
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
            data:"could not find tag"
        })
    }
}