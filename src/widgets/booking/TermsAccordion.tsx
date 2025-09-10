import { useState } from "react";
import { ChevronDown } from "lucide-react";

type ItemProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function AccordionItem({ title, children, defaultOpen = false }: ItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-WooridaumR flex w-full items-center justify-between rounded-xl px-4 py-3 text-[14px] font-semibold"
        aria-expanded={open}>
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="border-t border-gray-200">
          <div className="m-3 h-48 overflow-y-auto rounded-md border border-gray-200 p-3 text-[13px] leading-6 text-gray-700">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TermsAccordion({
  children,
  title = "개인정보 수집, 제공",
  defaultOpen = false,
}: {
  children: React.ReactNode;
  title?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-WooridaumR flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-bold"
        aria-expanded={open}>
        <span>{title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="space-y-2 px-3 pb-3">{children}</div> : null}
    </section>
  );
}

TermsAccordion.Item = AccordionItem;
export default TermsAccordion;
