const Section=require("../Models/Section")
const SubSection=require("../Models/SubSection");
const { uploadImageToCloudinary } = require("../Utils/imageUploader");

//create subsection
exports.createSubSection=async(req,res)=>{
    try{
        //data fetch
        const {sectionId,title,timeDuration,description}=req.body;
        const video=req.files.videoFile;
        //data validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //upload video to cloudinary
        const cloudinaryResponse=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create Sub Section
        const newSubSection=await SubSection.create({title:title,
            timeDuration:timeDuration,
            description,
            videoUrl:cloudinaryResponse.secure_url,
        });
        //update Section with subsection objectID
        const updatedSection=await Section.findByIdAndUpdate({sectionId},{
            $push:{
                subSection:newSubSection._id,
            }
        },{new:true}).populate("subSection").exec();
        //return res
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            newSubSection
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            error:err.message,
            message:"Could not create Sub Section"
        })
    }
}

//update subsection

exports.updateSubSection=async(req,res)=>{
    try{
        //data fetch
        const {subSectionId,title,timeDuration,description}=req.body;
        const video=req.files.videoFile;
        //data validation
        if( !subSectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //upload video to cloudinary
        const cloudinaryResponse=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create Sub Section
        const updatedSubSection=await SubSection.findByIdAndUpdate({subSectionId},
           {
            $push: {title:title,
                timeDuration:timeDuration,
                description,
                videoUrl:cloudinaryResponse.secure_url,
            }
           },{new:true});
        //return res
        return res.status(200).json({
            success:true,
            message:"SubSection updated successfully",
            updatedSubSection
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            error:err.message,
            message:"Could not create Sub Section"
        })
    }
}


//delete a sub section
exports.deleteSubSection=async(req,res)=>{
    try{
        const {subSectionId}=req.params;
        await SubSection.findByIdAndDelete({subSectionId});
        //have not yet deleted it from courseContent
        return res.status(200).json({
            success:true,
            message:"Sub Section deleted successfully",
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            error:err.message, 
            message:"Could not delete sub section"
        })
    }
}

exports.getSubSectionDetails=async(req,res)=>{
    try{
        const {subSectionId}=req.params;
        const subSectionDetails=await SubSection.findById({subSectionId});
        return res.status(200).json({
            success:true,
            message:"Sub Section Details fetched successfully",
            data:subSectionDetails,
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            error:err.message, 
            message:"Could not get sub section details"
        })
    }
}