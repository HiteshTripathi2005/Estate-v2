import React from "react";

const HomeMain = () => {
  return (
    <div className="relative bg-[url(https://static.wixstatic.com/media/82fcd3_1dcc53b4e88842c7816a8251e1102530~mv2_d_4896_3264_s_4_2.jpg)] bg-cover bg-center h-screen max-sm:h-[850px]">
      <div className="absolute inset-0 bg-black/50" id="home"></div>
      <div className="relative flex justify-center items-center flex-col h-full px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold underline p-6 bg-black/50">
          New Properties
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl text-white p-2 font-bold mt-2 md:mt-4 underline bg-black/50">
          EXCLUSIVELY BY SKYLINE
        </h2>
        <button className="text-xl md:text-2xl border-0 py-2 md:py-3 px-4 md:px-6 rounded-2xl bg-[#FF6500] text-white font-bold mt-4 md:mt-6 duration-300 hover:bg-red-700">
          <a href="#property">Explorer</a>
        </button>
      </div>
    </div>
  );
};

export default HomeMain;
