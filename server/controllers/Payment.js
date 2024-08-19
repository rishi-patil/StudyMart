const { instance } = require("../config/razorpay");
const crypto = require("crypto");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({ success: false, message: "Please provide Course Id" });
  }

  let totalAmt = 0;
  for (const courseItem of courses) {
    const course_id = courseItem.courseId;
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the course" });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is Already enrolled",
        });
      }
      totalAmt += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  const options = {
    amount: totalAmt * 100,
    currency: "INR",
    receipt: Date.now().toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "could not Initiate order",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

const enrollStudents = async (courses, userId, res) => {
  try {
    if (!courses || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide data for courses or userId",
      });
    }
    console.log("COURSE id", courses);
    console.log("User id", userId);

    for (const courseItem of courses) {
      const courseId = courseItem.courseId; // Extract courseId from courseItem
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(courseId) }, // Ensure courseId is a valid ObjectId
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      console.log("course", enrolledCourse);
      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "course not found",
        });
      }

      //find the student and add the course in their list
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      );

      //Send mail
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations from StudyMart",
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );

      console.log("email send successfully", emailResponse.response);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};
