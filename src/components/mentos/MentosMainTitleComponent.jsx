import React from "react";
import PropTypes from "prop-types";

function MentosMainTitleComponent({ mainTitle, ...props }) {
  return (
    <div>
      <p className="font-WooridaumB px-4 text-lg font-bold">{mainTitle}</p>
    </div>
  );
}

MentosMainTitleComponent.propTypes = { mainTitle: PropTypes.string };

export default MentosMainTitleComponent;
