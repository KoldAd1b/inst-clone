import React, { useState } from "react";
import {
  ChatIcon,
  UserGroupIcon,
  InformationCircleIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import defaultImg from "../../public/defaultUser.png";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MessageForm from "./MessageForm";
import SelfMessage from "./SelfMessage";
import FriendMessage from "./FriendMessage";

const NoMessages = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const clickHandler = () => {
    if (!user) return router.push("/auth/signin");
  };
  return (
    <div className="grid place-items-center h-full">
      <div className="flex flex-col align-center text-center">
        <ChatIcon className="h-28 " />
        <h2 className="text-xl font-medium ">
          {!user
            ? "You need to be logged in to view your messages"
            : "Your messages"}
        </h2>
        {user && (
          <p className="text-base font-light">
            Send private photos and messages to a friend or group
          </p>
        )}

        <button
          className="p-2 px-3 bg-blue-500/95 text-sm mt-3 transition rounded-md text-white self-center hover:-translate-y-1 active:!translate-y-0"
          onClick={clickHandler}
        >
          {!user ? "Login" : "Send Message"}
        </button>
      </div>
    </div>
  );
};

const MessageSection = ({ messages, chattingWith: otherUser, currentUser }) => {
  const isEmpty = messages.length < 1;
  const group = false;
  const { user } = useSelector((state) => state.auth);

  if (isEmpty && !otherUser) {
    return <NoMessages user={user} />;
  }

  return (
    <div className="h-full relative flex flex-col">
      <div className="flex justify-between p-4 pl-6 border-b-[1px] border-gray-400">
        <div className="flex gap-x-4 items-center ">
          <div className="h-8 w-8">
            {group ? (
              <UserGroupIcon />
            ) : (
              <img
                src={otherUser?.profileImg || defaultImg.src}
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>
          <h3 className="font-bold text-md">{otherUser?.username}</h3>
        </div>
        <InformationCircleIcon className="h-7 nav-button" />
      </div>
      <div className="messages-container">
        {messages.map((message) => {
          if (message.from === currentUser) {
            return <SelfMessage message={message} />;
          } else return <FriendMessage message={message} friend={otherUser} />;
        })}
      </div>
      <MessageForm user={otherUser} />
    </div>
  );
};

export default MessageSection;
