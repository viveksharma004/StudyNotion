const Section=require("../Models/Section");
const Course=require("../Models/Course");
const { findByIdAndDelete } = require("../Models/Category");


exports.createSection=async(req,res)=>{
    try{
        //data fetch
        const {sectionName,courseId}=req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //create section
        const newSection=await Section.create({sectionName});
        //update course with section objectID
        const updatedCourse=await Course.findByIdAndUpdate({courseID},
            {
                $push:{
                    courseContent:newSection._id,
                }
            }
            ,{new:true}
        ).populate(["Section","subSection"]).exec();
        console.log("Updated Course :: ",updatedCourse);
        //populate the section and subsection in course
        //return res
        return res.status(200).json({
            success:true,
            message:"Section created successfully"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            error:err.message,
            message:"Could not create section"
        })
    }
}

 
//update section

exports.updateSection=async(req,res)=>{
    try{
        const {sectionName,sectionId}=req.body;
        if(!sectionName){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const updatedSection=await Section.findByIdAndUpdate({sectionId},{
            $push:{
                sectionName:sectionName,
            }
        },{new:true});
        // console.log("Updated Section Name ::",updatedSection);

        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            updatedSection
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            error:err.message,
            message:"Could not update section"
        })
    }
}


exports.deleteSection=async(req,res)=>{
    try{
        const {sectionId}=req.params;
        await Section.findByIdAndDelete({sectionId});
        //have not yet deleted it from courseContent
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            error:err.message,
            message:"Could not delete section"
        })
    }
}

exports.getAllSection=async(req,res)=>{
    try{
        const {sectionId}=req.params;
        const sectionDetails=await Section.findById(sectionId).populate("subSection").exec();
        return res.status(200).json({
            success:true,
            message:"Section all details",
            data:sectionDetails,
        })
    }catch(err){
        return res.status({
            success:false,
            message:"Could not get all section details",
            error:err.message,
        })
    }
}