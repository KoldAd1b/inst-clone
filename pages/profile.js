import React, { useState } from "react";
import defaultImg from "../public/defaultUser.png";
import { CogIcon } from "@heroicons/react/solid";
import {
  ViewGridIcon,
  BookmarkIcon,
  TagIcon,
  CameraIcon,
} from "@heroicons/react/outline";
import UtilityModal from "../components/Utility/UtilityModal";
import { useDispatch } from "react-redux";
import { modalActions } from "../store/ModalSlice";
import { useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { storage } from "../firebase";
import { auth } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import ProfilePosts from "../components/Profile/ProfilePosts";
import Saved from "../components/Profile/Saved";
import Tagged from "../components/Profile/Tagged";
import ProfileDescription from "../components/Profile/ProfileDescription";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";

const elements = [
  {
    option: <ProfilePosts />,
    optionText: "Posts",
    Icon: <ViewGridIcon className="sm:h-4  h-6" />,
  },
  {
    option: <Saved />,
    optionText: "Saved",
    Icon: <BookmarkIcon className="sm:h-4  h-6" />,
  },
  {
    option: <Tagged />,
    optionText: "Tagged",
    Icon: <TagIcon className="sm:h-4  h-6" />,
  },
];

export default function Profile() {
  const [activeItem, setActiveItem] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const imagePickerRef = useRef();

  const uploadImage = async () => {
    if (profileImage) {
      try {
        const imgRef = ref(storage, `user/${user.uid}/profileImage`);

        if (user.photoPath) {
          await deleteObject(ref(storage, user.photoPath));
        }

        const imageData = await uploadString(imgRef, profileImage, "data_url");

        const downloadURL = await getDownloadURL(imgRef);

        await updateDoc(doc(db, "users", user.uid), {
          profileImg: downloadURL,
          photoPath: imageData.ref.fullPath,
        });
        const docs = await getDocs(
          query(collection(db, "posts"), where("userId", "==", [user.uid]))
        );

        if (docs.docs.length > 0) {
          for (const doc of docs.docs) {
            await updateDoc(doc(db, "posts", doc.id), {
              profileImg: downloadURL,
            });
          }
        }

        setProfileImage("");
        dispatch(modalActions.setUtilityModal(false));
        router.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const displayProfileImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setProfileImage(readerEvent.target.result);
    };
  };

  return (
    <>
      {user && (
        <UtilityModal>
          <div>
            {profileImage ? (
              <img
                src={profileImage}
                className="w-full object-contain cursor-pointer"
                alt=""
                onClick={() => setProfileImage(null)}
              />
            ) : (
              <div
                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                onClick={() => imagePickerRef.current.click()}
              >
                <CameraIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
            )}

            <div>
              <div className="mt-3 text-center sm:mt-5">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  {profileImage
                    ? "Click on the image to unselect"
                    : "Upload Image"}
                </Dialog.Title>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={imagePickerRef}
                  onChange={displayProfileImage}
                />
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                disabled={!profileImage}
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white  staticfocus:outline:none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                onClick={uploadImage}
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
              {error && (
                <p className="text-red-500 text-base text-center"> {error}</p>
              )}
            </div>
          </div>
        </UtilityModal>
      )}
      <section className="max-w-6xl xl:mx-auto mx-5 p-10 pb-5 ">
        <div className="flex items-center sm:flex-row flex-col">
          <div className="sm:px-20 xl::mr-20">
            <div
              className="w-36 h-36 md:h-52 md:w-52 relative group cursor-pointer  "
              onClick={() => dispatch(modalActions.setUtilityModal(true))}
            >
              <img
                src={user?.profileImg || defaultImg.src}
                className="w-full h-full object-cover rounded-full"
                alt="user_img"
              />
              <CameraIcon className="w-10 h-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 " />
              <div className="w-full h-full rounded-full bg-black/25 absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 "></div>
            </div>
          </div>
          <ProfileDescription />
        </div>
      </section>
      <section className="max-w-6xl xl:mx-auto mx-5 p-10 pt-5">
        <div className="h-0.5 w-full bg-gray-200"></div>

        <div className="flex justify-center">
          <div className="sm:px-20">
            <div className="w-10 md:w-52 h-1 bg-transparent md:block hidden"></div>
          </div>

          <ul className="flex items-center justify-start gap-x-10 mx-auto">
            {elements.map(({ Icon, optionText }, i) => {
              return (
                <li
                  className={`uppercase flex items-center gap-x-1 text-sm cursor-pointer active:-translate-y-1 transition rounded-md hover:shadow-md border-b-4 border-gray-700 p-2 ${
                    i !== activeItem && "opacity-50 !border-transparent"
                  }`}
                  key={optionText}
                  onClick={() => setActiveItem(i)}
                >
                  {Icon} <span className="hidden sm:block">{optionText}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-8">{elements[activeItem].option}</div>
      </section>
    </>
  );
}
