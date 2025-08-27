import React from "react";
import PropTypes from "prop-types";

function TitleTextComponent({ subtitle, context, ...props }) {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <span className="w-[30%] font-bold">{subtitle}</span>
      <span
        className={`flex-grow-1 text-[#354259] ${subtitle === "파일" ? "underline underline-offset-1" : ""}`}>
        {context}
      </span>
    </div>
  );
}

TitleTextComponent.propTypes = { subtitle: PropTypes.string, context: PropTypes.string };

export default TitleTextComponent;
