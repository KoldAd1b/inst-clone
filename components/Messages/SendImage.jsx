import { CameraIcon } from "@heroicons/react/outline";
import React from "react";
import { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";

const SendImage = ({ sendImage, error, loading }) => {
  const [image, setImage] = useState("");
  const imagePickerRef = useRef();

  const displayImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImage(readerEvent.target.result);
    };
  };
  return (
    <div>
      {image ? (
        <img
          src={image}
          className="w-full object-contain cursor-pointer"
          alt=""
          onClick={() => setImage(null)}
        />
      ) : (
        <div
          className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
          onClick={() => imagePickerRef.current.click()}
        >
          <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
      )}

      <div>
        <div className="mt-3 text-center sm:mt-5">
          <Dialog.Title
            as="h3"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            {image ? "Click on the image to unselect" : "Upload Image"}
          </Dialog.Title>
        </div>
        <div>
          <input
            type="file"
            hidden
            ref={imagePickerRef}
            onChange={displayImage}
          />
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          disabled={!image}
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white  staticfocus:outline:none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
          onClick={() => sendImage(image)}
        >
          {loading ? "Sending..." : "Send Image"}
        </button>
        {error && (
          <p className="text-red-500 text-base text-center"> {error}</p>
        )}
      </div>
    </div>
  );
};

export default SendImage;
