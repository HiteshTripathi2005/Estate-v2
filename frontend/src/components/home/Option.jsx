import React from "react";
import {motion} from "framer-motion";

const Option = () => {
    return (
        <div className="text-center h-full px-4 md:px-8 bg-gray-50">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                viewport={{once: true}}
                className="my-10 md:my-20"
            >
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    WHAT ARE YOU LOOKING FOR?
                </h1>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-6xl">
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    whileInView={{opacity: 1, x: 0}}
                    transition={{duration: 0.6}}
                    viewport={{once: true}}
                    className="relative"
                >
                    <img
                        src="https://static.wixstatic.com/media/82fcd3_48d7bda4accf4beea4cad4e58588a4c6~mv2_d_3000_2002_s_2.jpg"
                        alt="Rent"
                        className=" w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                    />
                    <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white transition-all duration-150 cursor-pointer hover:text-slate-200 text-2xl md:text-3xl lg:text-4xl font-bold bg-black/50 p-2 rounded-2xl">
                        Rent
                    </h1>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, x: 50}}
                    whileInView={{opacity: 1, x: 0}}
                    transition={{duration: 0.6}}
                    viewport={{once: true}}
                    className="relative"
                >
                    <img
                        src="https://static.wixstatic.com/media/82fcd3_5a0a204eb6d04dd7b6e8685c35d8691b~mv2_d_3000_2000_s_2.jpg"
                        alt="Buy"
                        className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                    />
                    <a className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white transition-all duration-150 cursor-pointer hover:text-slate-200 text-2xl md:text-3xl lg:text-4xl font-bold bg-black/50 p-2 rounded">
                        Buy
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Option;
