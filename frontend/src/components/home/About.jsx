import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto" id="about">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-8 text-slate-800 underline"
      >
        About Skyline Estate
      </motion.h1>
      <div className="flex flex-col gap-6">
        {[0, 1, 2].map((index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-slate-700 leading-relaxed"
          >
            {index === 0 && (
              <>
                Skyline Estate is a leading real estate agency that specializes
                in helping clients buy, sell, and rent properties in the most
                desirable neighborhoods. Our team of experienced agents is
                dedicated to providing exceptional service and making the buying
                and selling process as smooth as possible.
              </>
            )}
            {index === 1 && (
              <>
                Our mission is to help our clients achieve their real estate
                goals through expert advice, personalized service, and a deep
                understanding of the local market. Whether you're looking to
                buy, sell, or rent a property, we're here to help you every step
                of the way.
              </>
            )}
            {index === 2 && (
              <>
                With years of experience in the real estate industry, we have a
                proven track record of delivering results for our clients. Our
                team of agents has extensive knowledge of the local market and
                is committed to providing the highest level of service.
              </>
            )}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default About;
