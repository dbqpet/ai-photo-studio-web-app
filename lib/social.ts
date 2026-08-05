export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "threads"
  | "pinterest";

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

/** Official social profiles — update hrefs here when accounts change. */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "facebook",
    href: "https://www.facebook.com/aiimagesstudio",
    label: "Facebook",
  },
  {
    platform: "instagram",
    href: "https://www.instagram.com/ai.images_studio/",
    label: "Instagram",
  },
  {
    platform: "threads",
    href: "https://www.threads.net/@ai.images_studio",
    label: "Threads",
  },
  {
    platform: "pinterest",
    href: "https://www.pinterest.com/aiimagesstudio",
    label: "Pinterest",
  },
];
