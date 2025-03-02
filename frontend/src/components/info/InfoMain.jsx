import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import usePropertyStore from "./../../store/property.store";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Location from "./Location";
import Features from "./Features";
import { motion, AnimatePresence } from "framer-motion";
import useMessageStore from "../../store/message.store";
import { MdFavorite, MdFavoriteBorder, MdPerson } from "react-icons/md";
import { useAuthStore } from "../../store/auth.store";
import CompareButton from "../properties/CompareButton";
import { FaCheck, FaTimes, FaCalculator, FaFilePdf } from "react-icons/fa";
import toast from "react-hot-toast";
import MortgageWidget from "../property/MortgageWidget";
import { PDFDownloadButton } from "../profile/PropertyPDF";

const InfoMain = () => {
  const { user } = useAuthStore();
  const {
    getPropertyInfo,
    info,
    infoLoading,
    addWatchList,
    removeWatchList,
    purchaseProperty,
  } = usePropertyStore();
  const { addFriends } = useMessageStore();
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const navigate = useNavigate();

  const handelButtonClick = (id) => {
    addFriends(id, navigate);
  };

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);

    if (isInWatchlist) {
      removeWatchList(id);
    } else {
      addWatchList(id);
    }
  };

  const handlePurchaseClick = (e) => {
    e.preventDefault();
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      // Check if the user is the owner of the property
      if (user && user._id === info.owner._id) {
        setShowPurchaseModal(false);
        toast.error("You cannot purchase your own property");
        return;
      }

      await purchaseProperty(id);
      // Close the modal
      setShowPurchaseModal(false);
      // Add the owner as a friend and navigate to chat
      addFriends(info.owner._id, (path) => {
        // This callback will be called after navigation
        // Set a timeout to allow the chat page to load
        setTimeout(() => {
          // Find the message input and set its value
          const messageInput = document.querySelector(
            'input[placeholder="Type your message..."]'
          );
          if (messageInput) {
            const purchaseMessage = `Hello, I'm interested in purchasing your property "${
              info.title
            }" (₹${info.price.toLocaleString()}). Can we discuss the details?`;

            // Set the input value
            messageInput.value = purchaseMessage;

            // Dispatch an input event to trigger any listeners
            const event = new Event("input", { bubbles: true });
            messageInput.dispatchEvent(event);

            // Focus the input
            messageInput.focus();
          }
        }, 1000);

        navigate(path);
      });
    } catch (error) {
      console.error("Error purchasing property:", error);
      setShowPurchaseModal(false);
      toast.error("Failed to process purchase request");
    }
  };

  const handlePdfClick = () => {
    setShowPdfOptions(true);
  };

  const closePdfOptions = () => {
    setShowPdfOptions(false);
  };

  useEffect(() => {
    getPropertyInfo(id);

    function checkIsInWatchlist() {
      setIsInWatchlist(user?.watchlist?.includes(id));
    }

    checkIsInWatchlist();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const renderImageGallery = () => {
    if (isMobile) {
      return (
        <motion.div {...fadeIn}>
          <div className="mb-6">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              className="h-[300px] sm:h-[350px] rounded-xl shadow-md"
            >
              {info.images?.map((image, index) => (
                <SwiperSlide key={index} className="w-full h-full">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      );
    }

    if (info.images?.length <= 2) {
      return (
        <motion.div {...fadeIn}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {info.images?.map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl shadow-md w-full h-[300px] sm:h-[400px]"
              >
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div {...fadeIn} className="mb-8">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={2}
          className="h-[400px] rounded-xl shadow-md"
        >
          {info.images?.map((image, index) => (
            <SwiperSlide key={index} className="w-full h-[400px]">
              <img
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    );
  };

  // Owner information section
  const renderOwnerInfo = () => {
    if (!info.owner) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-gray-50 p-3 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <MdPerson className="text-blue-500" />
          Property Owner
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {info.owner.profilePic ? (
              <img
                src={info.owner.profilePic}
                alt={info.owner.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                <MdPerson className="text-2xl sm:text-3xl" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-base sm:text-lg text-gray-800">
              {info.owner.fullName}
            </h3>
            <p className="text-sm text-gray-600">{info.owner.email}</p>
            <button
              onClick={() => handelButtonClick(info.owner._id)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-full shadow-sm hover:bg-blue-700 transition-colors"
            >
              Contact Owner
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (infoLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="animate-pulse text-xl font-semibold">Loading...</div>
      </motion.div>
    );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-8"
      style={{ isolation: "isolate" }}
    >
      <IoMdArrowRoundBack
        className="size-7 mb-4 text-blue-600 text-lg cursor-pointer"
        onClick={() => navigate(-1)}
      />
      {renderImageGallery()}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-4 sm:space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b pb-4">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800">
            {info.title}
          </h1>
          <span className="px-4 sm:px-6 py-1 sm:py-2 bg-green-100 text-green-800 rounded-full capitalize w-fit text-sm font-semibold shadow-sm">
            {info.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
            ₹{info?.price?.toLocaleString()}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleWatchlistToggle}
              className="rounded-full px-[6px] py-[1px] hover:bg-gray-100 transition-colors border-[1px]"
              title={
                isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
              }
            >
              {isInWatchlist ? (
                <MdFavorite className="text-red-500 mt-[5px] size-6" />
              ) : (
                <MdFavoriteBorder className="text-gray-600 mt-[5px] size-6" />
              )}
            </button>
            <CompareButton property={info} />
            {info.owner && (
              <button
                onClick={() => handelButtonClick(info.owner._id)}
                className="px-3 py-1 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors"
              >
                <span className="text-sm sm:text-base md:text-xl underline">
                  Contact
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed sm:max-w-[70%]">
            {info.description}
          </p>
          <div className="flex gap-2 self-start sm:self-end">
            {user && info.owner && user._id === info.owner._id && (
              <NavLink
                to={`/properties/edit/${id}`}
                className="underline p-2 text-sm sm:text-base rounded-lg bg-blue-400 text-white whitespace-nowrap"
              >
                Edit Property
              </NavLink>
            )}
            <button
              onClick={handlePurchaseClick}
              className="underline p-2 text-sm sm:text-base rounded-lg bg-green-400 text-white whitespace-nowrap"
            >
              Purchase
            </button>
            <NavLink
              to={`/mortgage-calculator?price=${info.price}`}
              className="underline p-2 text-sm sm:text-base rounded-lg bg-blue-500 text-white whitespace-nowrap flex items-center"
            >
              <FaCalculator className="mr-1" /> Mortgage
            </NavLink>
            <button
              onClick={handlePdfClick}
              className="underline p-2 text-sm sm:text-base rounded-lg bg-red-500 text-white whitespace-nowrap flex items-center"
            >
              <FaFilePdf className="mr-1" /> PDF
            </button>
          </div>
        </div>

        {/* Add MortgageWidget component */}
        {info.price && <MortgageWidget propertyPrice={info.price} />}

        <Features info={info} />

        {renderOwnerInfo()}

        <Location info={info} />
      </motion.div>

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-3"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Confirm Purchase
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Are you interested in purchasing this property? Clicking confirm
                will connect you with the property owner to discuss the details.
              </p>
              <div className="flex flex-col space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{info.title}</h3>
                  <p className="text-blue-600 font-bold">
                    ₹{info?.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {info.location?.city}, {info.location?.state}
                  </p>
                  {info.owner && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MdPerson className="text-blue-500" />
                        Owner: {info.owner.fullName}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center text-sm sm:text-base"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                  <button
                    onClick={handleConfirmPurchase}
                    className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center text-sm sm:text-base"
                  >
                    <FaCheck className="mr-2" /> Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Options Modal */}
      <AnimatePresence>
        {showPdfOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-6 text-center">
                Generate PDF for {info.title}
              </h3>

              <div className="flex flex-col gap-4">
                <PDFDownloadButton properties={info} singleProperty={true} />

                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={closePdfOptions}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default InfoMain;
