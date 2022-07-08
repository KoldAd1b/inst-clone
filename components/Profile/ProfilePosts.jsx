import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { GridLoader } from "react-spinners";
import { auth, db } from "../../firebase";
import Loading from "../Utility/Loading";
import PostList from "./PostList";

const ProfilePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const collectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "posts"
      );
      const queryObj = query(collectionRef, orderBy("createdAt", "desc"));
      const docs = await getDocs(queryObj);
      let postArr = [];
      docs.forEach((doc) => {
        postArr.push(doc.data());
      });
      setPosts(postArr);
      setLoading(false);
    };
    if (auth.currentUser) {
      getPosts();
    }
  }, []);

  if (loading)
    return (
      <div className="w-full h-[75vh] flex justify-center items-center">
        <GridLoader color="#ccc" loading={loading} />
      </div>
    );

  const defaultDeleteButtonStyles = `bg-red-600 transition hover:bg-white py-2 px-2.5 rounded-md border-2 mb-4 border-red-600 text-white hover:text-red-600`;
  const deleteModeStyles = `bg-blue-600 transition hover:bg-white py-2 px-2.5 rounded-md  text-white hover:text-blue-600 mb-4 animate-pulse
  `;

  return (
    <>
      {posts.length > 0 && (
        <div className="flex w-full items-center justify-center">
          <button
            className={`${
              !deleteMode ? defaultDeleteButtonStyles : deleteModeStyles
            }`}
            onClick={() => setDeleteMode((prev) => !prev)}
          >
            {deleteMode
              ? "Click a post to delete. (Press this button to cancel)"
              : "Delete a post"}
          </button>
        </div>
      )}
      <PostList posts={posts} deleteMode={deleteMode} />;
    </>
  );
};

export default ProfilePosts;
