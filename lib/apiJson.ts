/**
 * Parse a fetch Response as JSON without throwing a cryptic
 * `Unexpected token '<'` when the platform returns an HTML error page
 * (Vercel timeout, 413, unhandled 500 document, etc.).
 */
export async function readApiJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("EMPTY_API_RESPONSE");
  }
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const looksLikeHtml =
      trimmed.startsWith("<") ||
      (res.headers.get("content-type") ?? "").includes("text/html");
    console.error(
      "[api] Non-JSON response",
      res.status,
      res.headers.get("content-type"),
      trimmed.slice(0, 180),
    );
    throw new Error(looksLikeHtml ? "HTML_API_RESPONSE" : "INVALID_API_JSON");
  }
}

export function isNonJsonApiError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return (
    err.message === "HTML_API_RESPONSE" ||
    err.message === "EMPTY_API_RESPONSE" ||
    err.message === "INVALID_API_JSON"
  );
}
