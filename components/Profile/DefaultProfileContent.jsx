import React from "react";
import ImageGrid from "./ImageGrid";

const DefaultProfileContent = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-white ">
      <div className="flex flex-col items-center justify-center lg:order-1 lg:w-4/6 mt-4 ">
        <h2 className="font-semibold text-lg">
          Start capturing and sharing your moments
        </h2>
        <p className="text-sm mb-4">
          Get the app to share your first photo or video
        </p>
        <div className="flex my-4 gap-4 ">
          <div className="flex bg-white shadow-sm border-2 px-3 rounded-md items-center cursor-pointer ">
            <img
              src="https://1000logos.net/wp-content/uploads/2016/10/Apple-Logo.png"
              alt="Apple logo"
              className="h-10 w-10 object-cover -ml-3 "
            />
            <div className="flex items-center flex-col justify-center -space-y-1">
              <h4 className="text-xs">Download on the </h4>
              <h3 className="font-light t text-lg tracking-wider">App Store</h3>
            </div>
          </div>
          <div className="flex bg-black shadow-sm border-2 px-3 py-1 rounded-md items-center cursor-pointer">
            <img
              src="https://www.logo.wine/a/logo/Google_Play/Google_Play-Icon-Logo.wine.svg"
              alt="Google Play logo"
              className="h-10 w-10 object-cover -ml-3 "
            />
            <div className="text-white flex  flex-col justify-center -space-y-1">
              <h4 className="text-xs font-light">GET IT ON </h4>
              <h3 className="font-light text-lg">Google Play</h3>
            </div>
          </div>
        </div>
      </div>
      <ImageGrid />
    </div>
  );
};

export default DefaultProfileContent;
