import React, { useState } from "react";
import dynamic from "next/dynamic";
import { EmojiHappyIcon, XCircleIcon, HeartIcon } from "@heroicons/react/solid";
import { PhotographIcon } from "@heroicons/react/outline";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import UtilityModal from "../Utility/UtilityModal";
import SendImage from "./SendImage";
import { modalActions } from "../../store/ModalSlice";
import { useDispatch } from "react-redux";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const MessageForm = ({ user }) => {
  const [message, setMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const currentlyActiveUser = auth.currentUser.uid;

  const onEmojiClick = (e, emojiObject) => {
    setMessage((prev) => `${prev}${emojiObject.emoji}`);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const generateId = () => {
    const userToChat = user.uid;
    const id =
      currentlyActiveUser > userToChat
        ? `${currentlyActiveUser + userToChat}`
        : `${userToChat + currentlyActiveUser}`;
    return id;
  };

  const updateLastMessage = async (message, id) => {
    await setDoc(doc(db, "lastMessage", id), {
      ...message,
      unread: true,
    });
  };

  const handleHeart = async () => {
    const messageToSend = {
      heart: true,
      from: currentlyActiveUser,
      to: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
    };
    try {
      setLoading(true);
      await addDoc(
        collection(db, "messages", generateId(), "chat"),
        messageToSend
      );
      await updateLastMessage(messageToSend, generateId());
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleImage = async (dataURL) => {
    try {
      setLoading(true);
      const imgRef = ref(storage, `messages/${generateId()}/media`);

      const imageData = await uploadString(imgRef, dataURL, "data_url");

      const downloadURL = await getDownloadURL(imgRef);

      const messageToSend = {
        image: downloadURL,
        imagePath: imageData.ref.fullPath,
        from: currentlyActiveUser,
        to: user.uid,
        createdAt: Timestamp.fromDate(new Date()),
      };

      await addDoc(
        collection(db, "messages", generateId(), "chat"),
        messageToSend
      );
      await updateLastMessage(messageToSend, generateId());

      dispatch(modalActions.setUtilityModal(false));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleButtonSubmit = async (e) => {
    e.preventDefault();
    const messageToSend = {
      text: message,
      from: currentlyActiveUser,
      to: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
    };

    setLoading(true);
    await addDoc(
      collection(db, "messages", generateId(), "chat"),
      messageToSend
    );
    await updateLastMessage(messageToSend, generateId());

    setMessage("");
    setLoading(false);
  };

  return (
    <>
      <UtilityModal>
        <SendImage sendImage={handleImage} error={error} loading={loading} />
      </UtilityModal>
      <form onSubmit={handleButtonSubmit}>
        <div className="z-10 p-4 w-full bg-white relative ">
          <div className="rounded-3xl border-[2px] border-gray-300 flex items-center pr-2  ">
            <div className="relative ml-2">
              {!emojiOpen ? (
                <EmojiHappyIcon
                  className="h-8 text-yellow-300 cursor-pointer"
                  onClick={() => setEmojiOpen(true)}
                />
              ) : (
                <XCircleIcon
                  className="h-8 text-black cursor-pointer"
                  onClick={() => setEmojiOpen(false)}
                />
              )}

              {emojiOpen && (
                <Picker
                  onEmojiClick={onEmojiClick}
                  pickerStyle={{ position: "absolute", bottom: "105%" }}
                />
              )}
            </div>
            <input
              type="text"
              className=" border-none rounded-3xl flex-1 focus:ring-0  focus:bg-white transition"
              placeholder="Enter a message"
              onChange={handleChange}
              value={message}
            />
            {!message ? (
              <>
                <PhotographIcon
                  className="h-8 nav-button"
                  onClick={() => dispatch(modalActions.setUtilityModal(true))}
                />
                <HeartIcon
                  onClick={handleHeart}
                  className="text-red-600 h-8 cursor-pointer "
                />
              </>
            ) : (
              <button
                className="text-blue-400 p-2  rounded-3xl bg-white  hover:text-gray-600 transition duration-300 active:!text-blue-400"
                type="submit"
                disabled={loading}
              >
                Send
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default MessageForm;
