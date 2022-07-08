import React from "react";
import defaultImg from "../../public/defaultUser.png";

const GroupMessage = ({ group, status }) => {
  return (
    <li className="flex gap-x-2.5 p-2 pl-4 ">
      <div className="w-14 h-14 relative  ">
        <img
          src={defaultImg.src}
          alt=""
          className="rounded-full object-contain"
        />
        <div
          className={`h-4 w-4 absolute rounded-full bottom-[2px] right-0 ${
            status === "Active" && "bg-green-400"
          }`}
        ></div>
      </div>
      <div>
        <h4 className="font-medium mt-1">{group}</h4>
        <p className="opacity-50 text-sm">{status}</p>
      </div>
    </li>
  );
};

export default GroupMessage;
