const Category = require("../models/Category");
const Tag = require("../models/Category");
const Course = require("../models/Course");

//Create Tag handler function

exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category created successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//Get all tags
exports.showAllCategory = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      message: "All Categories returned Successfully",
      data:allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;
    //console.log("Category id: ",categoryId);
    //get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    //console.log("Category Selected: ", selectedCategory);
    //validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "No courses available",
      });
    }

    //get courses for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    //get top 10 selling cources    
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
      .slice(0, 10);  


    //return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
