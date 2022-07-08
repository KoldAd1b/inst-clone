import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import { db } from "../../firebase";
import Loading from "../Utility/Loading";
import PostModal from "../Utility/PostModal";
import UtilityModal from "../Utility/UtilityModal";
import Post from "./Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState("");

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
          setLoading(false);
        }
      ),
    [db]
  );

  const setPostModalId = (id) => {
    setPostId(id);
  };

  if (loading) return <Loading />;

  return (
    <>
      {postId && <PostModal id={postId} />}
      <div className="flex flex-col items-center md:items-stretch w-[100vw] md:w-auto">
        {posts.map((post) => {
          return (
            <Post
              key={post.id}
              id={post.id}
              setPostModalId={() => setPostModalId(post.id)}
              username={post.data().username}
              userImg={post.data().profileImg}
              userId={post.data().userId}
              img={post.data().image}
              caption={post.data().caption}
              imgPath={post.data().imagePath}
            />
          );
        })}
      </div>
    </>
  );
};

export default Posts;
