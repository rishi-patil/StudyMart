import Footer from "../components/common/Footer"
import ContactForm from "../components/core/ContactUs/ContactForm"
import ContactDetails from "../components/core/ContactUs/ContactDetails";

const Contact = () => {
  return (
    <div>
          <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
              {/* Contact Details */}
              <div className="lg:w-[40%]">
                  <ContactDetails />
              </div>

              <div className="lg:w-[60%] mb-12">
                  <ContactForm/>
              </div>
          </div>
          
          <Footer/>
    </div>
  )
};

export default Contact;
