import React from "react";
import Image from "next/image";
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MenuIcon,
  HomeIcon,
} from "@heroicons/react/solid";
import defaultImg from "../public/defaultUser.png";
import { useRouter } from "next/dist/client/router";
import { useDispatch } from "react-redux";
import { modalActions } from "../store/ModalSlice";
import { logout } from "../auth";
import { useSelector } from "react-redux";
import { authActions } from "../store/authSlice";

const Header = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="shadow-sm border-b bg-white sticky top-0 z-50 md:p-0 py-4">
      <div className="flex justify-between bg-white max-w-6xl mx-5 xl:mx-auto">
        <div
          onClick={() => router.push("/")}
          className="relative hidden lg:inline-grid w-24  cursor-pointer"
        >
          <Image
            src="https://links.papareact.com/ocw"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div
          onClick={() => router.push("/")}
          className="relative w-10 lg:hidden flex-shrink-0 cursor-pointer"
        >
          <Image
            src="https://links.papareact.com/jjm"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="max-w-xs hidden md:block ">
          <div className="relative mt-1 p-3 rounded-md ">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-gray-50 sm:block w-full pl-10 sm:text-sm border-gray-300 
            focus:ring-black focus:border-black rounded-md hidden "
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <HomeIcon onClick={() => router.push("/")} className="nav-button" />

          <>
            <PaperAirplaneIcon
              className="nav-button rotate-45"
              onClick={() => router.push("/messages")}
            />

            <PlusCircleIcon
              onClick={() => dispatch(modalActions.setModal(true))}
              className="nav-button"
            />
            {/* <UserGroupIcon className="nav-button" />
            <HeartIcon className="nav-button" /> */}

            <img
              src={user?.profileImg || defaultImg.src}
              alt="Profile Picture"
              className="h-10 w-10 rounded-full cursor-pointer object-cover"
              onClick={() => router.replace("/profile")}
            />
          </>
          {!user ? (
            <button
              className="hover:opacity-70 transition"
              onClick={() => router.replace("/auth/signin")}
            >
              Sign In
            </button>
          ) : (
            <button
              className="hover:opacity-70 transition"
              onClick={async () => {
                await logout(user?.uid);
                dispatch(authActions.removeUser());
                router.replace("/");
              }}
            >
              {" "}
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
