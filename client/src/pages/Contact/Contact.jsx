import React, { useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiSend, FiCheck, FiMessageSquare } from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    if (!formData.phone.trim()) newErrors.phone = "Please enter your phone number";
    else if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.message.trim()) newErrors.message = "Please enter your message";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({ name: "", phone: "", message: "" });
          setIsSubmitted(false);
        }, 3000);
      }, 1500);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          <span className="text-red-600">Contact</span> Us
        </h1>
        <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
          We're always ready to listen and help. Contact us using the form below or through our contact information.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-600 to-red-700 py-5 px-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FiMessageSquare className="mr-3" />
              Send Us a Message
            </h2>
          </div>

          <div className="p-6">
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                      }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                      }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What would you like to tell us?"
                    rows="4"
                    className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${errors.message ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-red-200"
                      }`}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all flex items-center justify-center ${isSubmitting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-lg"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden shadow-xl border border-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3043.4165109802493!2d105.79381013486778!3d20.98041817567868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acc508f938fd%3A0x883e474806a2d1f2!2zSOG7jWMgdmnhu4duIEvhu7kgdGh14bqtdCBt4bqtdCBtw6M!5e0!3m2!1svi!2sus!4v1749284459033!5m2!1svi!2sus"
            width="100%"
            height="100%"
            style={{ minHeight: "400px", border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-t-xl"
          />
          <div className="bg-gradient-to-r from-red-600 to-red-700 py-5 px-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FiMapPin className="mr-3" />
              Our Location
            </h2>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-red-600">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FiMapPin className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Address</h3>
          <p className="text-gray-600">Academy of Cryptography Techniques</p>
          <p className="text-gray-500 text-sm mt-2">141 Chien Thang, Tan Trieu, Thanh Tri, Hanoi</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-red-600">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FiPhone className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Phone</h3>
          <p className="text-gray-600">+84 123 456 789</p>
          <p className="text-gray-500 text-sm mt-2">Monday - Friday: 8:00 AM - 5:00 PM</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 border-t-4 border-red-600">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FiMail className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email</h3>
          <p className="text-gray-600">contact@qad.com</p>
          <p className="text-gray-500 text-sm mt-2">Support: support@qad.com</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-16 bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8 text-center border border-red-200">
        <h2 className="text-2xl font-bold mb-4 text-red-800">Need Immediate Assistance?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          If you require urgent support, please call our hotline. Our support team is available 24/7 to assist you.
        </p>
        <div className="flex justify-center">
          <a
            href="tel:+84123456789"
            className="flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            <FiPhone className="mr-2" />
            Call Now: +84 123 456 789
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Frequently Asked <span className="text-red-600">Questions</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-red-200 transition-colors">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
              What are your business hours?
            </h3>
            <p className="text-gray-600">
              Our office is open Monday to Friday from 8:00 AM to 5:00 PM. For urgent matters outside these hours, please call our emergency hotline.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-red-200 transition-colors">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
              How quickly do you respond to inquiries?
            </h3>
            <p className="text-gray-600">
              We typically respond to all inquiries within 24 business hours. For urgent matters, we recommend calling our support hotline for immediate assistance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-red-200 transition-colors">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
              Can I visit your office without an appointment?
            </h3>
            <p className="text-gray-600">
              While we welcome visitors, we recommend scheduling an appointment in advance to ensure the appropriate staff members are available to assist you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-red-200 transition-colors">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
              Do you provide online consultations?
            </h3>
            <p className="text-gray-600">
              Yes, we offer online consultations via video conference. Please contact us to schedule a virtual meeting at your convenience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;