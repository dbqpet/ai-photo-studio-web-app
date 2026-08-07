const TECH_BASE_DIRECTORY_URL =
  "https://techbasedirectory.com/product/ai-images-studio";

interface TechBaseDirectoryBadgeProps {
  className?: string;
}

/** TechBaseDirectory featured badge — footer social proof alongside Product Hunt. */
export default function TechBaseDirectoryBadge({
  className = "",
}: TechBaseDirectoryBadgeProps) {
  return (
    <a
      href={TECH_BASE_DIRECTORY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="AI Images Studio featured on TechBaseDirectory"
      className={`group inline-flex max-w-full items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${className}`}
    >
      <span className="text-left text-[11px] leading-snug text-slate-500 sm:text-xs">
        Featured on{" "}
        <span className="font-semibold text-slate-800">TechBaseDirectory</span>
      </span>
    </a>
  );
}
