const mailSender = require("../utils/mailSender");
const contactUsEmail = require("../mail/templates/contactForm");

exports.contactUs = async (req, res) => {

    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
    try {
        await mailSender(
          email,
          "Your Data Send successfully",
          contactUsEmail(
            email,
            firstname,
            lastname,
            message,
            phoneNo,
            countrycode
          )
        );

        await mailSender(
          "patilrishi272@gmail.com",
          "Someone send you the data",
          contactUsEmail(
            email,
            firstname,
            lastname,
            message,
            phoneNo,
            countrycode
          )
        );

          return res.json({
            success: true,
            message: "Email send successfully",
          });

    }
    catch (error) {
          return res.json({
            success: false,
            message: "Something went wrong...",
          }); 
    }
}