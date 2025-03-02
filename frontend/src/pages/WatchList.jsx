import React from "react";
import WatchListMain from "../components/watchlist/WatchListMain";
import AuthNavbar from "../components/common/AuthNavbar";

const WatchList = () => {
  return (
    <div>
      <AuthNavbar />
      <div>
        <WatchListMain />
      </div>
    </div>
  );
};

export default WatchList;
