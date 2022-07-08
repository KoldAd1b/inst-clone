import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/ModalSlice";
import PostPreview from "../Home/PostPreview";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

const PostModal = ({ id }) => {
  const { openPost } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  return (
    <>
      <Transition.Root show={openPost} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto "
          onClose={() => dispatch(modalActions.setPostModal(false))}
        >
          <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen  pt-4 px-4 pb-28 text-center sm:p-0">
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
                <div className="inline-block align-bottom bg-white rounded-lg  text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  w-[400px] md:w-[775px]    md:h-[400px]  ">
                  <PostPreview postId={id} />
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default PostModal;
