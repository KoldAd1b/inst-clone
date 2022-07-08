import React, { useState, useEffect } from "react";
import { users } from "../../mock/users";
const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    setSuggestions(users.slice(1, 8));
  }, []);

  return (
    <div className="mt-4 ml-10">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="text-sm font-bold text-gray-400 ">
          Suggestions for you
        </h3>
        <button className="text-gray-600 font-semibold">See All</button>
      </div>
      {suggestions.map((profile) => (
        <div
          key={profile._id.$oid}
          className="flex items-center justify-between mt-3"
        >
          <img
            src={profile.image}
            className="w-10 h-10 rounded-full border p-[2px]"
          />
          <div className="flex-1 ml-4">
            <h2 className="font-semibold text-sm">{profile.username}</h2>
            <h3 className="text-xs text-gray-400">
              Works at {profile.company}
            </h3>
          </div>
          <button className="text-sm font-bold text-blue-400">Follow</button>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
