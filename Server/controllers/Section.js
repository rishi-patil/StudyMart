const mongoose = require("mongoose")
const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.CreateSection = async (req, res) => {
    try {
      //data fetch
      const { sectionName, courseId } = req.body;
      //data validation
      if (!sectionName || !courseId) {
        return res.status(400).json({
          success: false,
          message: "Missing required properties",
        });
      }

      //create section
      const newSection = await Section.create({ sectionName });

      // ensure courseId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid courseId",
        });
      }

      //update course with section objectID
      const updatedCourseDetails = await Course.findByIdAndUpdate(
        courseId ,
        {
          $push: {
            courseContent: newSection._id,
          },
        },
        { new: true }
      )
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();

      return res.status(200).json({
        success: true,
        message: "Section created successfully",
        updatedCourseDetails,
      });
    }
    catch (error) {
        return res.status(500).json({
        success: false,
        message: "Unable to create section please try again",
        error:error.message
        });
    }
}


exports.updateSection = async (req, res) => {
    try {
        //data input
        const { sectionName, sectionId } = req.body; 
        //data validation
         if (!sectionName || !sectionId) {
           return res.status(400).json({
             success: false,
             message: "All fields are required..!",
           });
         }
        //update data
        const updatedCourseDetails = await Section.findByIdAndUpdate(
          sectionId,
          { sectionName },
          { new: true }
        ).populate("subSection").exec();
        //return response
        return res.status(200).json({
          success: true,
          message: "Section updated successfully",
          updatedCourseDetails
         
        });
    }
    catch (error) {
         return res.status(500).json({
           success: false,
           message: "Unable to update section please try again",
           error: error.message,
         });
  }  
};

exports.deleteSection = async (req, res) => {
    try {
        //fetch id --assuming we are fetching in params
        const { sectionId,courseId } = req.body;
      console.log("section id", sectionId);
      await Course.findByIdAndUpdate(courseId, {
        $pull:{
            courseContent:sectionId
          }
      })
      const section = await Section.findById(sectionId);

      await SubSection.deleteMany({ _id: { $in: section.subSection } });
      await Section.findByIdAndDelete(sectionId);

      //TODO: Do we need to delete entry from course schems
      
      const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
      
        return res.status(200).json({
          success: true,
          message: "Section Deleted successfully",
          course,
        });

    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: "Unable to delete section please try again",
        error: error.message,
      });
    }  
}