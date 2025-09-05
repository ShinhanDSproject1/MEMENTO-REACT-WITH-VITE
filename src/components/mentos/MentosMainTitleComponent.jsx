import React from "react";
import PropTypes from "prop-types";

function MentosMainTitleComponent({ mainTitle, ...props }) {
  return (
    <div>
      <p className="font-WooridaumB mt-6 pl-2 text-[20px] font-bold">{mainTitle}</p>
    </div>
  );
}

MentosMainTitleComponent.propTypes = { mainTitle: PropTypes.string };

export default MentosMainTitleComponent;
