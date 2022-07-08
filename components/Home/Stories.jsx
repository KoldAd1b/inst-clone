import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { users } from "../../mock/users";
import defaultImg from "../../public/defaultUser.png";
import Story from "./Story";

const Stories = () => {
  const { user } = useSelector((state) => state.auth);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    setSuggestions(users);
  }, []);

  return (
    <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin hover:scrollbar-thumb-gray-500  scrollbar-thumb-black">
      {user && <Story img={defaultImg.src} username={"Ahnaf Adib"} />}
      {suggestions.map((profile) => {
        return (
          <Story
            key={profile._id.$oid}
            img={profile.image}
            username={profile.username}
          />
        );
      })}
    </div>
  );
};

export default Stories;
