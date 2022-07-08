import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/solid";

import { db, storage } from "../../firebase";
import {
  addDoc,
  doc,
  serverTimestamp,
  updateDoc,
  collection,
} from "@firebase/firestore";

import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/ModalSlice";
import { useRouter } from "next/router";
const Modal = () => {
  const { open } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const captionRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const uploadPost = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const post = {
      username: user.username,
      userId: user.uid,
      caption: captionRef.current.value,
      timestamp: serverTimestamp(),
    };
    let docRef = null;

    if (user.profileImg) {
      const documentRef = await addDoc(collection(db, "posts"), {
        ...post,
        profileImg: user.profileImg,
      });
      docRef = documentRef;
    } else {
      const documentRef = await addDoc(collection(db, "posts"), {
        ...post,
      });
      docRef = documentRef;
    }

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
          imagePath: snapshot.ref.fullPath,
        });

        await addDoc(collection(db, "users", user.uid, "posts"), {
          postId: docRef.id,
          img: downloadURL,
          imagePath: snapshot.ref.fullPath,
          createdAt: serverTimestamp(),
        });
      }
    );

    dispatch(modalActions.setModal(false));

    setLoading(false);

    setSelectedFile(null);
  };
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => dispatch(modalActions.setModal(false))}
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-28 text-center sm:p-0 ">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents.  */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full  ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom  bg-white rounded-lg px-5 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                {user ? (
                  <div>
                    {selectedFile ? (
                      <img
                        src={selectedFile}
                        className="w-full object-contain cursor-pointer"
                        alt=""
                        onClick={() => setSelectedFile(null)}
                      />
                    ) : (
                      <div
                        className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                        onClick={() => filePickerRef.current.click()}
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
                          Upload a photo
                        </Dialog.Title>
                      </div>
                      <div>
                        <input
                          type="file"
                          hidden
                          ref={filePickerRef}
                          onChange={addImageToPost}
                        />
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="border-none focus:ring-0 w-full text-center"
                          ref={captionRef}
                          placeholder="Please enter a caption..."
                        />
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        disabled={!selectedFile}
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white  staticfocus:outline:none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                        onClick={uploadPost}
                      >
                        {loading ? "Uploading..." : "Upload Post"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-center text-2xl text-red-600">
                      You need to be logged in to post
                    </h2>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
