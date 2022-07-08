import { doc, onSnapshot } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../../firebase";
import defaultImg from "../../public/defaultUser.png";
import Moment from "react-moment";

const truncate = (text, length) => {
  if (text.length > length) {
    return `${text.substring(0, length)}...`;
  }
  return `${text} - `;
};

const UserMessage = ({
  user: {
    isOnline = true,
    profileImg: img = null,
    name = "Instagram User",
    uid,
  },
  selectMe,
  selected,
  selfId,
}) => {
  const [message, setMessage] = useState();
  const unread = message?.from !== selfId && message?.unread;

  useEffect(() => {
    const id = selfId > uid ? `${selfId + uid}` : `${uid + selfId}`;

    return onSnapshot(doc(db, "lastMessage", id), (snapshot) => {
      setMessage(snapshot.data());
    });
  }, []);

  return (
    <li
      className={`flex gap-x-2.5 p-2 pl-4 hover:bg-gray-100 cursor-pointer w-full ${
        selected && "bg-gray-100"
      }`}
      onClick={() => selectMe()}
    >
      <div className="w-14 h-14 relative ">
        <img
          src={img || defaultImg.src}
          alt=""
          className="rounded-full  object-cover w-full h-full"
        />
        <div
          className={`h-4 w-4 absolute rounded-full bottom-[2px] right-0 ${
            isOnline && "bg-green-400"
          }`}
        ></div>
      </div>
      <div className="">
        <h4 className={`font-medium mt-1 ${unread && "font-extrabold"}`}>
          {name}
        </h4>
        <p
          className={`opacity-50 text-sm  ${
            unread && "font-bold opacity-100 "
          }`}
        >
          {!message && !selected && "Click to send a message to this user"}
          {message?.from === selfId && "You: "}
          {message?.text && truncate(message.text, 15)}
          {message?.image && "Sent an image"}
          {message?.heart && "❤️"}
          {message?.createdAt && (
            <Moment className="ml-1" fromNow>
              {message?.createdAt.toDate()}
            </Moment>
          )}
        </p>
      </div>
    </li>
  );
};

export default UserMessage;
