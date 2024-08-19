const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create Rating  
exports.createRating = async (req, res) => {
    try {
      //get userid
      const userId = req.user.id;
      //fetch data from req body
      const { rating, review, courseId } = req.body;

      //check if user already enrolled or not
      const courseDetails = await Course.findOne({
        _id: courseId,
        studentsEnrolled: { $elemMatch: { $eq: userId } },
      });

      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Student is not enrolled in the course",
        });
      }

      //check if user already reviewed the course
      const alreadyReviewed = await RatingAndReview.findOne({
        user: userId,
        course: courseId,
      });

      if (alreadyReviewed) {
        return res.status(403).json({
          success: false,
          message: "Course is already reviewed bu user.",
        });
        }
        
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user:userId,
        })

        //update course
       const updatedCourseDetails =  await Course.findByIdAndUpdate({_id:courseId}, {
            $push: {
                ratingAndReviews:ratingReview._id,
            }
        },{new:true})

        console.log(updatedCourseDetails);
        //return responce
        return res.status(200).json({
        success: true,
        message: "Rating and review created successfully",
          ratingReview
        });
        
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}

//get Average rating

exports.getAverageRating = async (req, res) => {
    try {
      //get Course Id
      const courseId = req.body.courseId;

      //calculating avg rating
      const result = await RatingAndReview.aggregate([
        {
          $match: {
            course: new mongoose.Types.ObjectId(courseId),
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      //return rating
      if (result.length > 0) {
        return res.status(200).json({
          success: true,
          averageRating: result[0].averageRating,
        });
        }
        
        //If no rating exist
         return res.status(200).json({
             success: true,
             message:"Average rating is 0, no rating given till now.",  
           averageRating: 0,
         });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}

//get All rating and reviews

exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({}).sort({ rating: "desc" }).populate({
            path: "user",
            select: "firstName lastName email image",
        }).pupulate({
            path: "course",
            select: "courseName"
        }).exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data:allReviews,
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}