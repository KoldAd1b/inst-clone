import React from "react";

const ImageGrid = () => {
  return (
    <div className="grid-cols-3 grid gap-4 lg:w-1/2 mt-5 lg:mt-0">
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/300x300"
          className="grid-image"
          alt="Grid Image"
        />
      </div>
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/300x299"
          alt="Grid Image"
          className="grid-image"
        />
      </div>
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/300x297"
          alt="Grid Image"
          className="grid-image"
        />
      </div>
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/299x300"
          alt="Grid Image"
          className="grid-image"
        />
      </div>
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/301x297"
          alt="Grid Image"
          className="grid-image"
        />
      </div>
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/300x296"
          alt="Grid Image"
          className="grid-image"
        />
      </div>
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/298x296"
          alt="Grid Image"
          className="grid-image"
        />
      </div>{" "}
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/300x295"
          alt="Grid Image"
          className="grid-image"
        />
      </div>{" "}
      <div className="grid-box">
        <img
          src="https://source.unsplash.com/random/301x296"
          alt="Grid Image"
          className="grid-image"
        />
      </div>
    </div>
  );
};

export default ImageGrid;
