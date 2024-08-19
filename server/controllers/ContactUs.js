const mailSender = require("../utils/mailSender");
const contactUsEmail = require("../mail/templates/contactForm");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message } = req.body;
  try {
    await mailSender(
      email,
      "Your Data Sent Successfully",
      contactUsEmail(email, firstname, lastname, message)
    );

    await mailSender(
      "patilrishi272@gmail.com",
      "Someone Sent You Data",
      contactUsEmail(email, firstname, lastname, message)
    );

    return res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error while sending emails:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
