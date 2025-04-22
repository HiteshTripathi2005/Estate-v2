import React from "react";
import AuthNavbar from "../components/common/AuthNavbar";
import MainUpload from "../components/upload/MainUpload";

const Upload = () => {
  return (
    <div>
      <AuthNavbar />
      <div className="mt-32">
        <MainUpload />
      </div>
    </div>
  );
};

export default Upload;
