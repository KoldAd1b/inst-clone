import { ViewGridIcon } from "@heroicons/react/outline";
import { CameraIcon, CogIcon } from "@heroicons/react/solid";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { GridLoader } from "react-spinners";
import PostList from "../../components/Profile/PostList";

import { db } from "../../firebase";
import defaultImg from "../../public/defaultUser.png";

const Posts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const collectionRef = collection(db, "users", userId, "posts");
      const posts = await getDocs(collectionRef);

      let data = [];
      posts.docs.forEach((post) => {
        data.push(post.data());
      });

      setPosts(data);
      setLoading(false);
    };
    getPosts();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[50vh]">
        <GridLoader loading={loading} color="#ccc0" />
      </div>
    );
  }
  if (posts.length < 1) {
    return (
      <div className="text-3xl font-semibold text-center ">
        This user currently has zero posts
      </div>
    );
  }

  return <PostList posts={posts} />;
};

const ProfileDescription = ({
  user: { username, bio, name },
  followers,
  following,
  followUser,
  postNumber,
  alreadyFollowed,
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center flex-col sm:flex-row  gap-4 ">
        <h2 className="font-light text-3xl">{username}</h2>
        <button
          onClick={followUser}
          className={`border-2 border-transparent px-3 py-1 ${
            alreadyFollowed
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black border-black/20"
          }`}
        >
          {alreadyFollowed ? "Followed" : "Follow"}
        </button>
        <CogIcon className="nav-button h-10 text-gray-500" />
      </div>
      <div className="flex gap-x-4 text-base my-4 order-1 sm:order-none sm:justify-start justify-center">
        <div>
          <span className="font-bold">{postNumber}</span> posts
        </div>
        <div className="">
          <span className="font-bold">{followers.length}</span> followers
        </div>
        <div>
          <span className="font-bold">{following.length}</span> following
        </div>
      </div>
      <div className="flex flex-col text-center sm:text-left">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-base text-gray-600">{bio}</p>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [followed, setFollowed] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [postNumber, setPostNumber] = useState(0);
  const { user: currentUser } = useSelector((state) => state.auth);

  const { userId } = router.query;

  useEffect(() => {
    const getUser = async () => {
      const docSnap = await getDoc(doc(db, "users", userId));

      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
    };
    getUser();
  }, [userId]);

  useEffect(() => {
    const getPostNumber = async () => {
      const data = await getDocs(collection(db, "users", userId, "posts"));

      setPostNumber(data.docs.length);
    };
    getPostNumber();
  }, [userId]);

  useEffect(() => {
    const getFollowing = async () => {
      const data = await getDocs(collection(db, "users", userId, "following"));
      console.log(data);
      setFollowing(data.docs);
    };

    getFollowing();
  }, [userId]);

  useEffect(() => {}, [userId]);

  useEffect(() => {
    return onSnapshot(
      collection(db, "users", userId, "followers"),
      (snapshot) => {
        setFollowers(snapshot.docs);
      }
    );
  }, [db]);

  useEffect(() => {
    return setFollowed(
      followers.findIndex((follower) => follower.id === currentUser.uid) !== -1
    );
  }, [db, followers]);

  const followUser = async () => {
    if (followed) {
      await deleteDoc(doc(db, "users", userId, "followers", currentUser.uid));
      await deleteDoc(doc(db, "users", currentUser.uid, "following", userId));
    } else {
      await setDoc(doc(db, "users", userId, "followers", currentUser.uid), {
        name: currentUser.name,
      });
      await setDoc(doc(db, "users", currentUser.uid, "following", userId), {
        name: user.name,
      });
    }
  };

  return (
    <>
      <section className="max-w-6xl xl:mx-auto mx-5 p-10 pb-5 ">
        <div className="flex items-center sm:flex-row flex-col">
          <div className="sm:px-20 xl::mr-20">
            <div className="w-36 h-36 md:h-52 md:w-52 relative group cursor-pointer  ">
              <img
                src={user?.profileImg || defaultImg.src}
                className="w-full h-full object-cover rounded-full"
                alt="user_img"
              />
            </div>
          </div>
          {user && (
            <ProfileDescription
              followUser={followUser}
              followers={followers}
              following={following}
              alreadyFollowed={followed}
              postNumber={postNumber}
              user={{
                name: user.name,
                bio: user.bio || "This user has not set a bio yet",
                username:
                  user.username || "This user has not set a username yet",
              }}
            />
          )}
        </div>
      </section>
      <section className="max-w-6xl xl:mx-auto mx-5 p-10 pt-5">
        <div className="h-0.5 w-full bg-gray-200"></div>

        <div className="flex justify-center">
          <div className="sm:px-20">
            <div className="w-10 md:w-52 h-1 bg-transparent md:block hidden"></div>
          </div>

          <div className="flex items-center justify-start gap-x-10 mx-auto">
            <div className="uppercase flex items-center gap-x-1 text-sm cursor-pointer active:-translate-y-1 transition rounded-md hover:shadow-md border-b-4 border-gray-700 p-2 ">
              <ViewGridIcon className="sm:h-4  h-6" />
              <span>Posts</span>
            </div>
          </div>
        </div>
        <div className="p-8">
          <Posts userId={userId} />
        </div>
      </section>
    </>
  );
};

export default UserProfile;
