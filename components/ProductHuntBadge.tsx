export const PRODUCT_HUNT_URL =
  "https://www.producthunt.com/products/ai-images-studio?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-ai-images-studio";

const PRODUCT_HUNT_BADGE_SRC =
  "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1212877&theme=light&t=1785900794572";

interface ProductHuntBadgeProps {
  className?: string;
}

/** Product Hunt Featured badge — responsive embed for footer social proof. */
export default function ProductHuntBadge({ className = "" }: ProductHuntBadgeProps) {
  return (
    <a
      href={PRODUCT_HUNT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex max-w-full transition-opacity hover:opacity-90 ${className}`}
      aria-label="AI Images Studio on Product Hunt"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Product Hunt widget SVG */}
      <img
        alt="AI Images Studio - Create HD passport & visa photos in 3 seconds with AI | Product Hunt"
        width={250}
        height={54}
        src={PRODUCT_HUNT_BADGE_SRC}
        className="h-auto w-[200px] max-w-full sm:w-[250px]"
      />
    </a>
  );
}
