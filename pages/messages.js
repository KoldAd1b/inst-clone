import React from "react";
import {
  ChevronDownIcon,
  PencilAltIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import UserMessage from "../components/Messages/UserMessage";
import MessageSection from "../components/Messages/MessageSection";
import GroupMessage from "../components/Messages/GroupMessage";
import { useState } from "react";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const messages = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState("");
  const [messages, setMessages] = useState([]);

  const currentlyActiveUser = auth.currentUser?.uid;

  useEffect(() => {
    if (auth.currentUser) {
      const usersRef = collection(db, "users");
      const queryObj = query(
        usersRef,
        where("uid", "not-in", [currentlyActiveUser])
      );

      const unsub = onSnapshot(queryObj, (snapshot) => {
        let users = [];
        snapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setUsers(users);
      });

      return () => unsub();
    }
  }, []);

  const selectUserToChat = async (user) => {
    setCurrentChat(user);

    const userToChat = user.uid;
    const id =
      currentlyActiveUser > userToChat
        ? `${currentlyActiveUser + userToChat}`
        : `${userToChat + currentlyActiveUser}`;

    const msgRef = collection(db, "messages", id, "chat");
    const queryObj = query(msgRef, orderBy("createdAt", "asc"));

    onSnapshot(queryObj, (snapshot) => {
      const messages = [];
      snapshot.forEach((message) => {
        messages.push(message.data());
      });
      setMessages(messages);
    });

    const lastMessage = await getDoc(doc(db, "lastMessage", id));

    if (lastMessage.exists()) {
      if (lastMessage.data()?.from !== currentlyActiveUser) {
        await updateDoc(doc(db, "lastMessage", id), {
          unread: false,
        });
      }
    }
  };

  return (
    <>
      <section className="max-w-6xl xl:mx-auto  p-5 h-[92.5vh] bg-gray-50/10 ">
        <div className="flex flex-col sm:flex-row border-[1px] shadow-md bg-white border-gray-400/50 sm:h-full h-screen ">
          <div className="sm:w-2/5 sm:h-full h-1/2 flex sm:flex-col border-b-2 sm:border-none  ">
            <div className="h-full w-full sm:w-auto border-r-2 ">
              <div className="flex justify-center p-4 relative border-gray-400 border-r-[1px] border-b-[1px] shadow-sm h-[12%]  sm:h-auto">
                <div className="inline-flex font-bold items-center  ">
                  {user?.username || "Direct"}
                  <span>
                    <ChevronDownIcon className="h-8" />{" "}
                  </span>
                </div>
                <span className="absolute right-[5%]">
                  <PencilAltIcon className="h-7" />
                </span>
              </div>
              <ul className="overflow-auto h-[88%]">
                {users.map((user) => {
                  return (
                    <UserMessage
                      user={user}
                      key={user.uid}
                      selectMe={() => selectUserToChat(user)}
                      selected={currentChat?.uid === user.uid}
                      selfId={currentlyActiveUser}
                    />
                  );
                })}
                {!user && (
                  <>
                    <UserMessage
                      selectMe={() => {}}
                      selected={true}
                      user={{ username: "Test", isOnline: true, name: "John" }}
                    />
                    <UserMessage
                      selectMe={() => {}}
                      selected={true}
                      user={{ username: "Test", isOnline: true, name: "Doe" }}
                    />
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="sm:w-3/5 overflow-auto">
            <MessageSection
              messages={messages}
              chattingWith={currentChat}
              currentUser={currentlyActiveUser}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default messages;
