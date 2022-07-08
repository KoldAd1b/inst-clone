import React, { useState } from "react";
import defaultUser from "../../public/defaultUser.png";
import Moment from "react-moment";
import dynamic from "next/dynamic";
import {
  ArrowCircleRightIcon,
  BookmarkIcon,
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
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { BeatLoader } from "react-spinners";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { modalActions } from "../../store/ModalSlice";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const PostPreview = ({ postId: id }) => {
  const [user, setUser] = useState();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);
  const [hasSaved, setHasSaved] = useState("");
  const [post, setPost] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const onEmojiClick = (e, emojiObject) => {
    setComment((prev) => `${prev}${emojiObject.emoji}`);
  };

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      const userSnap = await getDoc(doc(db, "users", docSnap.data().userId));

      setPost(docSnap.data());
      setUser(userSnap.data());
      setLoading(false);
    };
    getPost();
  }, [db, id]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [id]
  );

  useEffect(() => {
    if (currentUser) {
      return onSnapshot(
        collection(db, "users", currentUser.uid, "savedPosts"),
        (snapshot) => {
          setSavedPosts(snapshot.docs);
        }
      );
    }
  }, [currentUser, id]);
  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [id]
  );

  useEffect(
    () => setHasSaved(savedPosts.findIndex((post) => post.id === id) !== -1),
    [savedPosts, id]
  );

  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === currentUser?.uid) !== -1
      ),
    [likes, id]
  );

  const goToProfile = () => {
    dispatch(modalActions.setPostModal(false));
    if (post.userId === currentUser.uid) {
      router.push("/profile");
    } else {
      router.push("/profile/" + post.userId);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    const commentToSend = comment;
    setComment("");
    if (currentUser.profileImg) {
      await addDoc(collection(db, "posts", id, "comments"), {
        comment: commentToSend,
        username: currentUser.name,
        userImage: currentUser.profileImg,
        timestamp: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "posts", id, "comments"), {
        comment: commentToSend,
        username: currentUser.name,
        timestamp: serverTimestamp(),
      });
    }
  };
  const likePost = async (e) => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", currentUser.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", currentUser.uid), {
        username: currentUser.username,
      });
    }
  };

  const savePost = async (e) => {
    const userId = currentUser?.uid;
    if (!hasSaved) {
      const docRef = doc(db, "users", userId, "savedPosts", id);
      await setDoc(docRef, {
        postId: id,
        img: post.image,
      });
    } else {
      const docRef = doc(db, "users", userId, "savedPosts", id);
      await deleteDoc(docRef);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <BeatLoader loading={loading} color="#E1306C" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-[90vh] w-full items-center justify-center ">
        <h1 className="text-center text-3xl">This post does not exist</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg  h-full ">
      <div className="md:hidden flex items-center py-2 px-4 ">
        <img
          src={post.profileImg || defaultUser.src}
          alt="user"
          className="rounded-3xl h-12 w-12 object-cover p-1 mr-3   "
        />
        <p className="flex-1 font-bold  ">{user?.username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>
      <img
        src={post.image}
        alt="post_img"
        className="   w-[450px] h-[350px] md:h-auto   rounded-tl-lg rounded-bl-lg "
      />

      <div className="flex md:w-[55%] pt-6 md:pt-0">
        <div className="flex flex-1 flex-col justify-between">
          <div className="md:flex items-center md:p-5 p-2 border-b-2 md:h-[15%] hidden ">
            <img
              src={post.profileImg || defaultUser.src}
              alt="user"
              //   onError={(e) => {
              //     e.target.src = defaultUser;
              //     e.onerror = null;
              //   }}
              className="rounded-3xl h-12 w-12 object-cover p-1 mr-3"
            />
            <p className="flex-1 font-bold ">{post.username}</p>

            <DotsHorizontalIcon className="h-5" />
          </div>

          {comments.length > 0 ? (
            <div className="ml-5 h-[50%] overflow-y-scroll scrollbar-thumb-black scrollbar-thin hidden md:block ">
              {comments.map((comment) => {
                return (
                  <div
                    key={comment.id}
                    className="flex gap-y-3 items-start mb-3 flex-col py-2"
                  >
                    <div className="flex items-center gap-x-2 ">
                      <img
                        className="h-7 w-7 rounded-full  object-cover"
                        src={comment.data().userImage || defaultUser.src}
                      />
                      <p className="text-sm flex-1">
                        <span className="font-bold mr-2">
                          {comment.data().username}
                        </span>
                        {comment.data().comment}
                      </p>
                    </div>

                    <Moment className="pr-5 text-xs ml-2 font-medium" fromNow>
                      {comment.data().timestamp.toDate()}
                    </Moment>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ml-5 h-[50%] scrollbar-thumb-black scrollbar-thin hidden md:block">
              <p>Be the first one to comment!</p>
            </div>
          )}

          {user && (
            <div className="flex justify-between md:p-4 py-2 px-4 ">
              <div className="flex space-x-4">
                {hasLiked ? (
                  <HeartIcon
                    onClick={likePost}
                    className="btn-global text-red-500"
                  />
                ) : (
                  <HeartIconOutline onClick={likePost} className="btn-global" />
                )}

                <div
                  onClick={() => {
                    setShowForm((prev) => !prev);
                  }}
                  className="btn-global text-white bg-black p-3 py-4 flex items-center rounded-lg hover:bg-white hover:text-black border-black border-2"
                >
                  {showForm ? "Close" : "Add comment"}
                </div>
                <ArrowCircleRightIcon
                  onClick={goToProfile}
                  className="btn-global"
                />
              </div>
              {hasSaved ? (
                <BookmarkIcon className="btn-global" onClick={savePost} />
              ) : (
                <BookmarkOutline className="btn-global" onClick={savePost} />
              )}
            </div>
          )}
          <p className="md:p-5 py-2 px-4 truncate  ">
            {likes.length > 0 && (
              <span className="font-bold mb-1 block ">
                {likes.length} likes
              </span>
            )}
            <span className="font-bold mr-1 hidden md:inline ">
              {post.username}
            </span>
            <span className="hidden md:inline">{post.caption}</span>
          </p>

          {user && showForm ? (
            <form className="items-center flex md:p-4 py-2 px-4 relative ">
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
          ) : (
            <div className="items-center flex md:p-4 py-2 px-4 relative"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
