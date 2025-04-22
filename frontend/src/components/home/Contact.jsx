import React, { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaUser,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "../../utils/axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const social = [
    {
      icon: <FaFacebook />,
      link: "https://www.facebook.com/",
    },
    {
      icon: <FaTwitter />,
      link: "https://twitter.com/",
    },
    {
      icon: <FaInstagram />,
      link: "https://www.instagram.com/",
    },
    {
      icon: <FaLinkedin />,
      link: "https://www.linkedin.com/",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      const response = await axios.post("/contact/send-email", formData);

      if (response.data.success) {
        setStatus({
          type: "success",
          message: "Message sent successfully! We'll get back to you soon.",
        });

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4" id="contact">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center my-7"
      >
        Contact Us
      </motion.h1>

      {status.message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Name"
          className="border p-[5px] rounded-lg text-2xl"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-[5px] rounded-lg text-2xl"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
        />
        <textarea
          placeholder="Message"
          className="border p-[5px] rounded-lg text-2xl"
          rows="5"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          disabled={loading}
        />
        <button
          className={`${
            loading ? "bg-slate-500" : "bg-slate-700 hover:opacity-95"
          } text-white p-3 rounded-lg uppercase`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-12 grid md:grid-cols-2 gap-8"
      >
        <div className="bg-slate-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <p className="flex items-center">
              <span className="font-semibold mr-2">Address:</span>
              nallasopara mumbai, maharashtra, 401203
            </p>
            <p className="flex items-center">
              <span className="font-semibold mr-2">Phone:</span>
              +91 9321554212
            </p>
            <p className="flex items-center">
              <span className="font-semibold mr-2">Email:</span>
              skylineestate@gmail.com
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {social.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="text-slate-700 hover:text-slate-900"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
          <div className="space-y-2">
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-12 text-center border-t pt-6 text-slate-600"
      >
        <p>
          &copy; {new Date().getFullYear()} Real Estate. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Contact;
