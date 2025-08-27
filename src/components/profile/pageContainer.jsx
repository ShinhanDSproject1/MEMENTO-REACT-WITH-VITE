import PropTypes from "prop-types";

export default function PageContainer({ className = "", children }) {
  return <div className={`mx-auto w-full px-4 ${className}`}>{children}</div>;
}

PageContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
