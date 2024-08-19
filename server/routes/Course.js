const express = require("express");
const router = express.Router();


const {createCourse,getAllCourses, getCourseDetails, getInstructorCourses,deleteCourse } = require("../controllers/Course");
const { createCategory, showAllCategory, categoryPageDetails } = require("../controllers/Category");
const { CreateSection, updateSection, deleteSection } = require("../controllers/Section");
const { createSubSection, updateSubSection, subSectionDelete } = require("../controllers/Subsection");
const { createRating, getAverageRating, getAllRating } = require("../controllers/RatingAndReview");
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");


//ROUTES FOR INSTRUCTOR

router.post("/createCourse", auth, isInstructor, createCourse); //done
router.post("/addsection", auth, isInstructor, CreateSection); //
router.post("/updateSection", auth, isInstructor, updateSection); //
router.post("/deleteSection", auth, isInstructor, deleteSection);//
router.post("/addSubSection", auth, isInstructor, createSubSection); //
router.post("/updateSubSection", auth, isInstructor, updateSubSection);// 
router.post("/subsectionDelete", auth, isInstructor, subSectionDelete);//
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.get("/getAllCourses", getAllCourses); //
router.get("/getCourseDetails", getCourseDetails); // 
router.delete("/deleteCourse", deleteCourse);


//ROUTES  FOR ADMIN //done

router.post("/createCategory", auth, isAdmin, createCategory); //
router.get("/showAllCategory", showAllCategory); //
router.post("/getCategoryPageDetails", categoryPageDetails);  //


//ROUTES FOR STUDENT

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRating", getAllRating);

module.exports = router;