import React from "react";
import { CogIcon } from "@heroicons/react/solid";
import { XCircleIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { validateName } from "../../utils/validators";
import { useSelector } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Loading from "../Utility/Loading";

const Default = ({
  setEditMode,
  user: { bio, username, name },
  postNumber,
  followerNumber,
  followingNumber,
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center flex-col sm:flex-row  gap-4 ">
        <h2 className="font-light text-3xl">{username}</h2>
        <button
          className="bg-gray-50 border-[1px] px-2 py-1 font-bold  rounded-sm border-gray-400"
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </button>

        <CogIcon className="nav-button h-10 text-gray-500" />
      </div>
      <div className="flex gap-x-4 text-base my-4 order-1 sm:order-none sm:justify-start justify-center">
        <div>
          <span className="font-bold">{postNumber}</span> posts
        </div>
        <div className="">
          <span className="font-bold">{followerNumber}</span> followers
        </div>
        <div>
          <span className="font-bold">{followingNumber}</span> following
        </div>
      </div>
      <div className="flex flex-col text-center sm:text-left">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-base text-gray-600">{bio}</p>
      </div>
    </div>
  );
};
const Editable = ({
  setEditMode,
  user: { username, bio, name },
  setSubmitted,
}) => {
  const [form, setForm] = useState({
    username,
    name,
    bio,
  });
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState();
  const usernameRef = useRef(null);

  useEffect(() => {
    return usernameRef.current.focus();
  }, []);

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const submitChanges = async (e) => {
    e.preventDefault();
    if (!user) return;
    const { name, username, bio } = form;

    if (!name || !username || !bio) {
      return setError("You cannot update empty fields");
    }
    const invalidName = validateName(form.name);
    if (invalidName) return setError(invalidName);

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        username,
        bio,
        name,
      });
      setEditMode(false);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submitChanges}>
      <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
        <div className="flex items-center justify-between flex-col sm:flex-row  gap-4 ">
          <input
            type="text"
            value={form.username}
            name="username"
            placeholder="Your username"
            onChange={handleFormChange}
            className="font-light md:text-xl text-md rounded-lg  focus:ring-1 focus:shadow-md w-1/2 bg-gray-100 border-none"
            ref={usernameRef}
          />

          <XCircleIcon
            className="h-10 w-10 text-red-500 hover:text-red-900 transition-colors cursor-pointer"
            onClick={() => setEditMode(false)}
          />
          <button
            className="bg-blue-400 border-[1px] px-2 py-2.5 font-bold  rounded-sm text-white "
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating" : "Confirm Changes"}
          </button>
        </div>

        <div className="flex flex-col text-center sm:text-left gap-4">
          <input
            type="text"
            className="font-semibold text-md border-none  bg-black/5 rounded-lg  focus:ring-1 focus:shadow-md"
            placeholder="Your Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
          />

          <textarea
            value={form.bio}
            className="bg-black/5 rounded-lg  focus:ring-1 focus:shadow-md"
            placeholder="Enter your bio"
            onChange={handleFormChange}
            name="bio"
          >
            {form.bio}
          </textarea>
        </div>
      </div>
      <p className="text-red-500 text-center ">{error}</p>
    </form>
  );
};

const ProfileDescription = () => {
  const [editMode, setEditMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState();

  const [postNumber, setPostNumber] = useState(0);
  const [followerNumber, setFollowerNumber] = useState(0);
  const [followingNumber, setFollowingNumber] = useState(0);

  useEffect(() => {
    const getInfo = async () => {
      const posts = await getDocs(
        collection(db, "users", auth.currentUser.uid, "posts")
      );
      const followers = await getDocs(
        collection(db, "users", auth.currentUser.uid, "followers")
      );
      const following = await getDocs(
        collection(db, "users", auth.currentUser.uid, "following")
      );

      setPostNumber(posts.docs.length);
      setFollowerNumber(followers.docs.length);
      setFollowingNumber(following.docs.length);
    };

    if (auth.currentUser) {
      getInfo();
    }
  }, [user]);

  useEffect(() => {
    async function getUser() {
      const fetchedUser = await getDoc(doc(db, "users", auth.currentUser?.uid));
      const { bio, name, username } = fetchedUser.data();
      setUser({ bio, username, name });
    }
    if (!auth.currentUser) {
      return setUser({
        bio: "Please login in order to view your details",
        username: "Test_101",
        name: "Testing user",
      });
    } else {
      getUser();
    }
  }, [submitted]);

  if (user) {
    if (editMode)
      return (
        <Editable
          setEditMode={setEditMode}
          setSubmitted={setSubmitted}
          user={user}
        />
      );
    else
      return (
        <Default
          followerNumber={followerNumber}
          followingNumber={followingNumber}
          postNumber={postNumber}
          setEditMode={setEditMode}
          user={user}
        />
      );
  } else {
    return <Loading />;
  }
};

export default ProfileDescription;
