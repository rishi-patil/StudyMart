const { isInstructor } = require("../middlewares/auth");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const mongoose = require("mongoose");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/setToDuration");

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;

    //get userid
    const id = req.user.id; //fetch from login
    //validation
    if (!gender || !id) {
      return res.status(400).json({
        success: false,
        message: "Some fields are required",
      });
    }

    //find Profile
    const userDetails = await User.findById(id);
    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save(); //saving in DB

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile Update Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to Update Profile, Please try again.",
      error: error.message,
    });
  }
};

//deleteAccount

exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validate
    const userDetails = await User.findById({ _id: id });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User does not  exist",
      });
    }

    //delete profile
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(userDetails.additionalDetails),
    });

    //TODO unenroll user from enrolled cources
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        {
          $pull: {
            studentsEnrolled: id,
          },
        },
        { new: true }
      );
    }
    //delete user
    await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to Delete Profile, Please try again.",
      error: error.message,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    //get id
    const id = req.user.id;

    //userDetails
    // const userDetails = await User.findById(id)
    //   .populate("additionalDetails")
    //   .exec();

    const userDetails = await User.findById(id)
      .populate({
        path: "courses",
        select: "courseName courseDescription", // Specify fields to select
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Fetched user details Successfully.",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to Fetch user details, Please try again.",
      error: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    console.log(image);

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allusers = await User.find({}).populate("additionalDetails").exec();

    return res.status(200).json({
      success: true,
      message: "Fetched user details Successfully.",
      data: allusers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to Fetch All user details, Please try again.",
      error: error.message,
    });
  }
};

//GET ENROLLED COURSES

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details and populate related data
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    console.log("Populated Courses: ", userDetails.courses);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }
    console.log("DATA ", userDetails);
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//INSTRUCTOR DASHBOARD

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalamtcollected = course.price * totalStudentsEnrolled;

      const courseStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalamtcollected,
      };

      return courseDataWithStats;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
