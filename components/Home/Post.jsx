import React, { useEffect, useState } from "react";
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/outline";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import { auth, db, storage } from "../../firebase";
import defaultUser from "../../public/defaultUser.png";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PostModal from "../Utility/PostModal";
import { useDispatch } from "react-redux";
import { modalActions } from "../../store/ModalSlice";
import { deleteObject, ref } from "firebase/storage";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const Post = ({
  username,
  userImg,
  img,
  id,
  caption,
  userId,
  setPostModalId,
  imgPath,
}) => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);
  const [hasSaved, setHasSaved] = useState("");
  const commentRef = useRef(null);

  const onEmojiClick = (e, emojiObject) => {
    setComment((prev) => `${prev}${emojiObject.emoji}`);
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, "users", user.uid, "savedPosts"),
        (snapshot) => {
          setSavedPosts(snapshot.docs);
        }
      );
    }
  }, [db, id, user]);

  useEffect(
    () => setHasSaved(savedPosts.findIndex((post) => post.id === id) !== -1),
    [savedPosts, id]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );
  useEffect(
    () => setHasLiked(likes.findIndex((like) => like.id === user?.uid) !== -1),
    [likes, id]
  );

  const goToProfile = () => {
    if (userId === user.uid) {
      router.push("/profile");
    } else {
      router.push("/profile/" + userId);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: user.username,
      userImage: user.profileImg,
      timestamp: serverTimestamp(),
    });
  };
  const likePost = async (e) => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", user?.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", user?.uid), {
        username: user.username,
      });
    }
  };

  const savePost = async (e) => {
    const userId = user?.uid;

    if (!hasSaved) {
      const docRef = doc(db, "users", userId, "savedPosts", id);
      await setDoc(docRef, {
        postId: id,
        img: img,
      });
    } else {
      const docRef = doc(db, "users", userId, "savedPosts", id);
      await deleteDoc(docRef);
    }
  };

  return (
    <>
      <div className="bg-white my-7 border rounded-sm w-[90%] md:w-[auto] ">
        <div className="flex items-center p-5">
          <img
            src={userImg || defaultUser.src}
            alt="User profile"
            onError={(e) => {
              e.target.src = defaultUser.src;
              e.onerror = null;
            }}
            onClick={goToProfile}
            className="rounded-3xl h-12 w-12 object-cover p-1 mr-3 cursor-pointer"
          />
          <p className="flex-1 font-bold ">{username}</p>

          <DotsHorizontalIcon className="h-5" />
        </div>
        <div className="md:h-[500px]  w-full flex justify-center ">
          <img src={img} className="md:object-cover md:w-auto  w-[400px] " />
        </div>

        {user && (
          <div className="flex justify-between px-4 pt-4">
            <div className="flex space-x-4">
              {hasLiked ? (
                <HeartIcon
                  onClick={likePost}
                  className="btn-global text-red-500"
                />
              ) : (
                <HeartIconOutline onClick={likePost} className="btn-global" />
              )}

              <ChatIcon
                onClick={() => commentRef.current.focus()}
                className="btn-global"
              />
              <PaperAirplaneIcon
                className="btn-global"
                onClick={() => {
                  setPostModalId();
                  dispatch(modalActions.setPostModal(true));
                }}
              />
            </div>
            {hasSaved ? (
              <BookmarkIcon className="btn-global" onClick={savePost} />
            ) : (
              <BookmarkOutline className="btn-global" onClick={savePost} />
            )}
          </div>
        )}

        <p className="p-5 truncate">
          {likes.length > 0 && (
            <span className="font-bold mb-1 block">{likes.length} likes</span>
          )}
          <span className="font-bold mr-1">{username}</span>
          {caption}
        </p>

        {/* comments */}
        {comments?.length > 0 && (
          <div className="ml-10 h-28 overflow-y-scroll scrollbar-thumb-black scrollbar-thin border-l-2">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                className="flex items-center space-x-2 mb-3 ml-3"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={comment.data().userImage || defaultUser}
                />
                <p className="text-sm flex-1">
                  <span className="font-bold mr-2">
                    {comment.data().username}
                  </span>
                  {comment.data().comment}
                </p>
                <Moment className="pr-5 text-xs" fromNow>
                  {comment.data().timestamp?.toDate()}
                </Moment>
              </div>
            ))}
          </div>
        )}
        {user && (
          <form className="items-center flex p-4 relative">
            {!emojiOpen ? (
              <EmojiHappyIcon
                className="h-8 text-black cursor-pointer"
                onClick={() => setEmojiOpen(true)}
              />
            ) : (
              <XCircleIcon
                className="h-8 text-black cursor-pointer"
                onClick={() => setEmojiOpen(false)}
              />
            )}

            <input
              type="text"
              ref={commentRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border-none focus:ring-0 outline:none"
              placeholder="Add a comment..."
            />
            <button
              disabled={!comment.trim()}
              onClick={sendComment}
              type="submit"
              className="font-semibold text-blue-400"
            >
              Post
            </button>
            {emojiOpen && (
              <Picker
                onEmojiClick={onEmojiClick}
                pickerStyle={{ position: "absolute", bottom: "105%" }}
              />
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default Post;
