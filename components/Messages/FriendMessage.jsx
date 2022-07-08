import React, { useEffect, useRef } from "react";
import placeholder from "../../public/placeholder.jpg";
import defaultImg from "../../public/defaultUser.png";
import Heart from "./Heart";

const FriendMessage = ({
  message = { text: "Hi man " },
  friend = { pasoori: "Aaglava", username: "_azmanalam" },
}) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);
  return (
    <div ref={scrollRef}>
      <p className="w-4/5 ml-10 text-sm font-extralight opacity-60">
        {friend.username}
      </p>
      {message.image && (
        <div className="pl-2  ml-6 ">
          <img
            src={message.image || placeholder.src}
            alt="message_img"
            className="object-contain w-64 h-64 rounded-xl"
          />{" "}
        </div>
      )}

      <div className="max-w-[60%] w-max mb-5 ">
        <div className="flex gap-x-3 ">
          <img
            src={friend.profileImg || defaultImg.src}
            className=" object-cover rounded-full w-6 h-6"
          />
          {message.heart && (
            <div className="-mt-3">
              <Heart />
            </div>
          )}

          {message.text && (
            <div className="mr-auto max-w-4/5 rounded-3xl px-4 py-3 border-[1.5px] border-gray-200/90 shadow-sm">
              <p className="text-sm leading-normal opacity-80 ">
                {message.text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendMessage;
