const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate"); 
const Profile = require("../models/Profile");
//SendOTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    //console.log("OTP Body", otpBody);

      const emailBody = otpTemplate(otp);
      // Send email using mailSender
      await mailSender(email, "Your OTP Code", emailBody);
      console.log("Email sent successfully.");

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,otp,
    });
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//Signup
exports.signUp = async (req, res) => {
  try {
    //data fetch from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate karo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //2 password match karlo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password value does not match",
      });
    }
    //check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already registered",
      });
    }

    //find most recent OTP stored for user
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    //Validate OTP
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //HASH password
    const hashedPassword = await bcrypt.hash(password, 10);
    //entry create in db
    //he update karne .. jevha user create hoil tevhach hi entry tayar vhayla havi...
    const profileDetails = await Profile.create({
      gender: null,
      dataOfBirth: null,
      about: null,
      contactNumber: null,
    });


    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return res
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registed, Please try again",
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;
    //validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fiels are required",
      });
    }

    //user check exits or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered, Please sign up",
      });
    }
    //generate jwt token after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //generate cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 34 * 60 * 60 * 100),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure, Please try again..",
    });
  }
};

// //ChangePassword
// exports.changePassword = async (req, res) => {
//   //get data from req body

//   const { email, password } = req.body;

//   if(!old)

// }


