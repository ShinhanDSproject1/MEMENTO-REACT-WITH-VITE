import PropTypes from "prop-types";

export default function FieldRow({ label, htmlFor, children }) {
  return (
    <div className="mb-4 flex min-w-0 items-center gap-2">
      <label
        htmlFor={htmlFor}
        className="w-24 shrink-0 text-sm font-semibold text-[#121418] md:text-base">
        {label}
      </label>
      {children}
    </div>
  );
}
FieldRow.propTypes = {
  label: PropTypes.string.isRequired,
  htmlFor: PropTypes.string,
  children: PropTypes.node,
};
