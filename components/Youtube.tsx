import React from "react";

const Youtube = (props) => {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/7H-hzkZlbzY?si=2rD0oSgIsFfsAvNO"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        {...props}
      />
    </div>
  );
};

export default Youtube;
