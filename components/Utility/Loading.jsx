import React from "react";
import ClimbingBoxLoader from "react-spinners/ClipLoader";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <ClimbingBoxLoader loading={true} size={150} color={"#E1306C"} />
    </div>
  );
};

export default Loading;
