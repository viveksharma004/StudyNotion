const Course=require("../Models/Course");
const Category=require("../Models/Category");
const User=require("../Models/User");
const {uploadImageToCloudinary}=require("../Utils/imageUploader")


//create courser handler 
exports.createCourse=async (req,res)=>{
     try{
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,tag,category}=req.body;
        //get thumbnail
        const thumbnail=req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !category){
            return res.status(400).json({
                success:false,
                message:"All fields are mandatory!!!"
            })
        }

        //check for the instructor and getting the object id of the instructor
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);
        console.log("Instructors data",instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Detail not found"
            })
        }

        //check if tag is valid or not
        const categoryDetails=await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:"Category Detail not found"
            })
        }
        //upload image to cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
         
        //create new entry
        const newCourse=await Course.create({
            courseName,courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            tag:tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        });

        //add new course to user schema of instructor
        await User.findByIdAndUpdate({_id:instructorDetails._id},
                {
                    $push:{
                    courses:newCourse._id
                }}
            ,{new:true}
        );

        //update category schema
        await Category.findByIdAndUpdate({_id:categoryDetails._id},
            {
                $push:{
                    course:newCourse._id
                }
            }
            ,{new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newCourse,
        })
     }catch(err){
        console.log("Error while creating course",err.message);
        return res.status(500).json({
            success:false,
            message:"Course could not Created"
     })
     }
}



//get all courses
exports.showAllCourses=async (req,res)=>{
    try{
        const allCourses=await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            ratingAndReview:true,
            studentsEnrolled:true,
            instructor:true,
        }).populate(["courseContent","ratingAndReview","Category"]).exec();

        return res.status(200).json({
            success:true,
            data:allCourses,
            message:"All courses details fetched successfully"
        })
    }catch(err){
        console.log("Error during the getting all course details",err.message);
        return res.status(500).json({
            success:false,
            message:"Could not fetch all the course data"
        })
    }
}