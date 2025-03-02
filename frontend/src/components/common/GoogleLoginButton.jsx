import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "../../store/auth.store";
import { PulseLoader } from "react-spinners";

const GoogleLoginButton = ({ buttonText = "Continue with Google" }) => {
  const { googleLogin, googleAuthLoading } = useAuthStore();

  const handleGoogleLogin = async () => {
    await googleLogin();
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={googleAuthLoading}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition-all duration-200 mt-4"
    >
      {googleAuthLoading ? (
        <PulseLoader color="#4285F4" size={8} />
      ) : (
        <>
          <FcGoogle className="text-xl" />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
};

export default GoogleLoginButton;
