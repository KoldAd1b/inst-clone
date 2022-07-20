import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import PostModal from "../Utility/PostModal";
import DefaultProfileContent from "./DefaultProfileContent";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/ModalSlice";
import { TrashIcon } from "@heroicons/react/solid";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";

const PostList = ({ posts, deleteMode }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [postId, setPostId] = useState("");
  const dispatch = useDispatch((state) => state.auth);

  const handlePostClick = (id) => {
    if (deleteMode) {
      return;
    }
    setPostId(id);
    dispatch(modalActions.setPostModal(true));
  };

  const deletePost = async (id, path) => {
    if (deleteMode) {
      await deleteDoc(doc(db, "users", user.uid, "posts", id));
      await deleteDoc(doc(db, "users", user.uid, "savedPosts", id));
      await deleteDoc(doc(db, "posts", id));
      await deleteObject(ref(storage, path));
      router.reload();
    }
  };

  if (posts.length < 1 || !user) {
    return <DefaultProfileContent />;
  }

  return (
    <>
      <PostModal id={postId} />
      <div className="lg:grid-cols-3 md:grid-cols-2 grid grid-cols-1 gap-4 mt-5 lg:mt-0 justify-items-center">
        {posts.map((item) => (
          <div
            className="grid-box relative group flex justify-center  h-[225px]  sm:w-full  cursor-pointer border-transparent rounded-lg shadow-lg overflow-hidden"
            key={item.postId}
            onClick={() => handlePostClick(item.postId)}
          >
            <div className="w-[450px] h-full ">
              <img
                src={item.img}
                className="h-full w-full object-contain object-center "
                alt="post_img"
              />
            </div>

            {!deleteMode ? (
              <>
                <div className="bg-black/20 absolute inset-0 opacity-0 group-hover:opacity-100 z-10 w-full h-full"></div>
                <button className="text-white top-full py-2 px-3 absolute group-hover:top-1/2 group-hover:left-1/2 bg-blue-400 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2  transition opacity-0 group-hover:opacity-100 font-black">
                  View
                </button>
              </>
            ) : (
              <div>
                <button className="text-white top-full absolute group-hover:top-1/2 group-hover:left-1/2  group-hover:-translate-x-1/2 group-hover:-translate-y-1/2  transition opacity-0 group-hover:opacity-100 font-black">
                  <TrashIcon
                    className="text-red-600 h-12"
                    onClick={() => deletePost(item.postId, item.imagePath)}
                  />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;
