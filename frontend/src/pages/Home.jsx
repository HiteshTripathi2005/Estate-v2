import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import HomeMain from "../components/home/HomeMain";
import Option from "../components/home/Option";
import Buy from "../components/home/Buy";
import About from "../components/home/About";
import Contact from "../components/home/Contact";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <Navbar />
      <HomeMain />
      <Option />
      <Buy />
      <About />
      <Contact />
    </motion.div>
  );
};

export default Home;
