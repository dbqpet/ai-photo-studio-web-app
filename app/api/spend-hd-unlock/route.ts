import { POST as downloadHd } from "@/app/api/download-hd/route";

export const runtime = "nodejs";

/** Alias kept for older clients. */
export const POST = downloadHd;
