// import React, { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
// import { useAuthStore } from "../../store/auth.store";
// import { FaUser } from "react-icons/fa";

// const Navbar = () => {
//   const { user } = useAuthStore();
//   const [isOpen, setIsOpen] = useState(false);
//   const navRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (navRef.current && !navRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const items = [
//     { href: "#home", text: "Home" },
//     { href: "#property", text: "Property" },
//     { href: "#about", text: "About" },
//     { href: "#contact", text: "Contact" },
//   ];

//   return (
//     <nav
//       ref={navRef}
//       className="bg-[#091d35]/95 backdrop-blur-sm fixed w-full z-50 shadow-lg"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pr-8 ">
//         <div className="flex justify-between items-center h-16 sm:h-20">
//           {/* Logo */}
//           <div className="flex items-center">
//             <svg
//               className="w-8 h-8 sm:w-12 sm:h-12 text-white"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8 lg:space-x-8">
//             {items.map((item, index) => (
//               <a
//                 key={index}
//                 href={item.href}
//                 className="text-white font-Caveat text-2xl lg:text-3xl transition-all duration-300 hover:text-[#f9a826] hover:scale-105 "
//               >
//                 {item.text}
//               </a>
//             ))}
//             {!user ? (
//               <NavLink
//                 to="/login"
//                 className="text-white font-Caveat text-2xl lg:text-3xl transition-all duration-300 hover:text-[#f9a826] hover:scale-105"
//               >
//                 Login
//               </NavLink>
//             ) : (
//               <NavLink
//                 to="/profile"
//                 className="text-white font-Caveat text-2xl lg:text-3xl transition-all duration-300 hover:text-[#f9a826] hover:scale-105 pt-2"
//               >
//                 <FaUser />
//               </NavLink>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="text-white p-2 rounded-md bg-transparent border-0 focus:outline-none"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 {isOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         <div
//           className={`${
//             isOpen
//               ? "opacity-100 translate-y-0"
//               : "opacity-0 -translate-y-4 pointer-events-none"
//           } md:hidden absolute left-0 right-0 bg-[#091d35]/95 backdrop-blur-sm transition-all duration-300 ease-in-out`}
//         >
//           <div className="px-4 pt-2 pb-3 space-y-2 shadow-lg">
//             {items.map((item, index) => (
//               <div key={index}>
//                 <a
//                   href={item.href}
//                   className="text-white font-Caveat text-2xl block px-3 py-2 rounded-md hover:bg-[#f9a826]/20 hover:text-[#f9a826] transition-all duration-300"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.text}
//                 </a>
//               </div>
//             ))}
//             {!user ? (
//               <NavLink
//                 to="/login"
//                 className="text-white font-Caveat text-2xl block px-3 py-2 rounded-md hover:bg-[#f9a826]/20 hover:text-[#f9a826] transition-all duration-300"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Login
//               </NavLink>
//             ) : (
//               <NavLink
//                 to="/profile"
//                 className="text-white font-Caveat text-2xl block px-3 py-2 rounded-md hover:bg-[#f9a826]/20 hover:text-[#f9a826] transition-all duration-300"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <FaUser />
//               </NavLink>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { BsBuildings, BsHouseDoor } from "react-icons/bs";
import { AiOutlineInfo } from "react-icons/ai";
import { CiLocationArrow1 } from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";

const Navbar = () => {
  const navLinks = [
    { title: "Home", path: "#home", icon: <BsHouseDoor size={18} /> },
    { title: "Properties", path: "#property", icon: <BsBuildings size={18} /> },
    { title: "About", path: "#about", icon: <AiOutlineInfo size={18} /> },
    {
      title: "Contact",
      path: "#contact",
      icon: <CiLocationArrow1 size={18} />,
    },
    {
      title: "Login",
      path: "/login",
      icon: <MdOutlineAccountCircle size={18} />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 flex justify-center items-center py-5 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="bg-white rounded-full shadow-lg px-6 py-2 hover:scale-[1.02] transition-all duration-300">
        <div className="flex space-x-3 md:space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              title={link.title}
              className="text-gray-700 hover:text-blue-600 px-4 py-2.5 text-sm font-medium relative group rounded-full transition-all duration-300 hover:bg-gray-50"
            >
              <span className="flex items-center justify-center">
                {link.icon}
              </span>
              <span className="absolute bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
