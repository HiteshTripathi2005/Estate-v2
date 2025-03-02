import React from "react";
import AuthNavbar from "../components/common/AuthNavbar";
import AllPropertiesMap from "../components/Map/AllPropertiesMap";

const Map = () => {
  return (
    <div>
      <AuthNavbar />
      <div className="mt-[90px] h-[calc(100vh-6rem)]">
        <AllPropertiesMap />
      </div>
    </div>
  );
};

export default Map;
