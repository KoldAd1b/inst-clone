import React, { useRef } from "react";
import Heart from "./Heart";
import placeholder from "../../public/placeholder.jpg";
import { useEffect } from "react";

const SelfMessage = ({ message = { text: "Wassup bro" } }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);
  return (
    <div ref={scrollRef}>
      {message.image && (
        <div className="pl-2 ">
          <img
            src={message.image || placeholder.src}
            alt="message_img"
            className="object-contain w-64 h-64 ml-auto rounded-xl"
          />
        </div>
      )}

      <div className="ml-auto max-w-[60%] w-max rounded-3xl flex items-end flex-col  mb-5">
        {message.text && (
          <p className="text-sm leading-normal opacity-80 rounded-3xl bg-gray-400/20 px-4 py-3">
            {message.text}
          </p>
        )}

        {message.heart && <Heart />}
      </div>
    </div>
  );
};

export default SelfMessage;
