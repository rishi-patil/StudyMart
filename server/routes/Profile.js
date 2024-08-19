const express = require("express");
const router = express.Router();

const { auth, isInstructor,isAdmin } = require("../middlewares/auth");
const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateDisplayPicture,
  instructorDashboard,
  getAllUsers,
  getEnrolledCourses,
} = require("../controllers/Profile");



router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteProfile", auth, deleteAccount);//
router.get("/getAllUserDetails", auth, getAllUserDetails);//
router.get("/getAllUsers", auth, isAdmin, getAllUsers);//

router.get("/getEnrolledCourses", auth, getEnrolledCourses); 
router.put("/updateDisplayPicture", auth, updateDisplayPicture);//
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;