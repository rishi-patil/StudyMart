const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
  enrollStudent,
} = require("../controllers/Payment");

const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
// router.post("/enrollStudent/:userId/:courses", auth, async (req, res) => {
//   const { userId, courses } = req.params;
//   const courseArray = courses.split(",");
//   await enrollStudent(courseArray, userId, res);
// });

router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

module.exports = router;
