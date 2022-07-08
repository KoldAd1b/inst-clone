import React, { useState } from "react";
import { useSelector } from "react-redux";
import DefaultProfileContent from "./DefaultProfileContent";
import postImg from "../../public/defaultPost.jpg";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import PostList from "./PostList";
import Loading from "../Utility/Loading";
import { GridLoader } from "react-spinners";

const Saved = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const collectionRef = collection(db, "users", user.uid, "savedPosts");
      const docs = await getDocs(query(collectionRef));

      let postArr = [];
      docs.forEach((doc) => {
        postArr.push(doc.data());
      });
      setPosts(postArr);
      setLoading(false);
    };
    if (user) getPosts();
  }, []);

  if (loading)
    return (
      <div className="w-full h-[75vh] flex justify-center items-center">
        <GridLoader color="#ccc" loading={loading} />
      </div>
    );
  return <PostList posts={posts} />;
};

export default Saved;
