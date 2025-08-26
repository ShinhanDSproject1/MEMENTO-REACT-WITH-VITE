import PropTypes from "prop-types";

export default function HelpCard({ title, description, link }) {
  return (
    <a
      href={link}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-WooridaumB text-base font-semibold text-slate-900">{title}</h3>
          <p className="font-WooridaumB mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button className="font-WooridaumB shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:ring-2 focus:ring-slate-300 focus:outline-none">
          바로가기
        </button>
      </div>
    </a>
  );
}

HelpCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  link: PropTypes.string,
};
