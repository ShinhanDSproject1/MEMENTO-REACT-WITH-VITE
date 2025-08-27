import PropTypes from "prop-types";

export default function CommonInput({ className = "", editable = true, ...props }) {
  return (
    <input
      {...props}
      disabled={!editable}
      className={`w-full rounded-lg px-3 py-2 text-sm outline-none ${
        editable
          ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
          : "cursor-not-allowed border border-gray-300 bg-gray-200 text-gray-700"
      } ${className}`}
    />
  );
}

CommonInput.propTypes = {
  className: PropTypes.string,
  editable: PropTypes.bool,
};
