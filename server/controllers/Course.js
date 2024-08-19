const Course = require("../models/Course")
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//Create cource handler Function

exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const {
          courseName,
          courseDescription,
          whatYouWillLearn,
          price,
          category,
          tag: _tag,
          instructions: _instructions,
        } = req.body;

        //get thumbnail
      const thumbnail = req.files.thumbnailImage; 
      
       const tag = JSON.parse(_tag);
      const instructions = JSON.parse(_instructions);
      
      console.log("tag", tag);
     // console.log("instructions", instructions);

        //Validation
        if (
          !courseName ||
          !courseDescription ||
          !whatYouWillLearn ||
          !price ||
          !category ||
          !tag.length ||
          !thumbnail ||
          !instructions.length ||
          !category 
        ) {
          return res.status(400).json({
            success: false,
            message: "All fields are required",
          });
      }
      let status = req.body.status;
      if (!status || status === undefined) {
        status = "Draft";
      }
      
        //Check for Instructor to store it in db course schema
        const userId = req.user.id;
      const instructorDetails = await User.findById(userId);
      
        console.log("Instructor Details: ", instructorDetails);
        // TODO : verify user id and instuctor id same or not

        if (!instructorDetails) {
            return res.status(404).json({
              success: false,
              message: "Instructor Details not found.",
            });
        }

        //check given category is valid or not
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
             return res.status(404).json({
               success: false,
               message: "Category Details not found.",
             });
        }

        //upload Image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
         const newCourse = await Course.create({
           courseName,
           courseDescription,
           instructor: instructorDetails._id,
           whatYouWillLearn,
           price,
           tag,
           category: categoryDetails._id,
           thumbnail: thumbnailImage.secure_url,
           status: status,
           instructions,
         });

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            }, { new: true }
        );

        //update the category schema
        await Category.findByIdAndUpdate(
          { _id: category },
          {
            $push: {
              courses: newCourse._id,
            },
          }
        );

        //return responce
        return res.status(200).json({
            success: true,
            message: "Course Added succesfully.",
            data:newCourse,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}

//Get all cources function

exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({},
            // {
            //     courseName: true,
            //     price: true,
            //     thumbnail: true,
            //     instructor: true,
            //     ratingAndReviews: true,
            //     studentsEnrolled: true,
            // }
        )
            .populate("instructor")
            .exec();
        
        return res.status(200).json({
          success: true,
          message: "Data for all cources fetched succesfully.",
          data: allCourses,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
           success: false,
           message: "Failed to get course data",
           error: error.message,
         });
    }
}


//get course details

exports.getCourseDetails = async (req, res) => {
    try {
        //Get id
      const { courseId } = req.query.courseId;
      console.log("Course id in backend ", courseId);
      
        //get course details
        const courseDetails = await Course.findOne({ _id: courseId })
          .populate({
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          })
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
              select: "-videoUrl",
            },
          })
          .populate("category")
          .populate("ratingAndReviews")
          .exec();
        
        //Validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}.`
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course Details Fetched Successfully.",
            data:courseDetails,
        })
        
    }
    catch (error) {
        console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to get course details",
        error: error.message,
      });  
    }
}


//GET INSTRUCTOR COURSES

exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

     res.status(200).json({
       success: true,
       data: instructorCourses,
     });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Insrturctor course details",
      error: error.message,
    });  
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await subSections.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};