import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../auth";
import defaultImg from "../../public/defaultUser.png";
import { authActions } from "../../store/authSlice";
const MiniProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img
        className="rounded-full border p-[2px] w-16 h-16"
        src={user.profileImg || defaultImg.src}
        alt="User img"
      />
      <div className="flex-1 mx-4">
        <h2 className="font-bold">{user.name}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>
      <button
        onClick={async () => {
          await logout(user?.uid);

          router.reload();
        }}
        className="text-blue-400 text-sm font-semibold hover:opacity-70"
      >
        Sign Out
      </button>
    </div>
  );
};

export default MiniProfile;
