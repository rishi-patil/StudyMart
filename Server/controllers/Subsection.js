const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Course = require('../models/Course');  
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//Create subsection

exports.createSubSection = async (req, res) => { 
    try {
        //fetch data from req.body
        const { sectionId, title, timeDuration, description } = req.body;
        //extract video from file
        const video = req.files.videoFile;
        //validation
        if (!sectionId || !title || !timeDuration || !description || !video) {
             return res.status(400).json({
               success: false,
               message: "All fields are required..!",
             });
        }
        //upload video to cloudinary

        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        );
        //create a subsection
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        //update section with this subsection ObjectId  
      const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId },
        {
          $push: {
            subSection: subSectionDetails._id,
          }
        }, { new: true }
      ).populate({
        path: "subSection"
      }).exec();

        //return response
         return res.status(200).json({ success: true, data: updatedSection });
        
    }
    catch (error) {
        return res.status(500).json({
          success: false,
          message: "Unable to create subsection please try again",
          error: error.message,
        });
    }
}

exports.updateSubSection = async (req, res) => { 
    try {
        //fetch data
        const { sectionId, title, subSectionId, description } = req.body;
        const subSection = await SubSection.findById(subSectionId);

        //data validation
        if (!subSection) {
          return res.status(400).json({
            success: false,
            message: "Subsection not found..!",
          });
        }

        let uploadDetails;
         const video = req.files?.videoFile;

        if (video) {
          uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
          );
        }
        const subSectionDetails = await SubSection.findByIdAndUpdate(
            { _id: subSectionId },
            {
                title: title || subSection.title,
                description: description || SubSection.description,
                videoUrl: uploadDetails?.secure_url || SubSection.videoUrl,
            }, { new: true },
        );
      
        
        return res.status(200).json({
            success: true
        });
    }
    catch (error) {
          return res.status(500).json({
            success: false,
            message: "Unable to update subsection please try again",
            error: error.message,
          });
    }
}

exports.subSectionDelete = async (req, res) => {
    try {
        const { subSectionId, courseId,sectionId } = req.body;
        
        const subSection = await SubSection.findByIdAndDelete(subSectionId);
        

          if (!subSection) {
            return res.status(400).json({
              success: false,
              message: "Subsection not found..!",
            });
        }

        await Section.findByIdAndUpdate(
          { _id: sectionId },
          {
            $pull: {
              subSection: subSectionId,
            },
          }
        );
        
        const updatedCourse = await Course.findById(courseId)
          .populate({
            path: "courseContent",
            populate: { path: "subSection" },
          })
            .exec();
        
        return res.status(200).json({
          success: true,
          data: updatedCourse,
        });

    }
    catch (error) {
          return res.status(500).json({
            success: false,
            message: "Unable to Delete subsection please try again",
            error: error.message,
          });
    }
}