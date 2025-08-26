import PropTypes from "prop-types";

export default function CardSection({ className = "", children }) {
  return (
    <div
      className={`w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6 ${className}`}>
      {children}
    </div>
  );
}

CardSection.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
