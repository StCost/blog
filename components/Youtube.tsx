import React from "react";

const Youtube = (props) => {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        title="YouTube video player"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        {...props}
      />
    </div>
  );
};

export default Youtube;
