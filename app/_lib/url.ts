const FORBIDDEN_PARAMS = [
  "token",
  "access_token",
  "id_token",
  "refresh_token",
  "jwt",
  "session",
  "sessionid",
  "auth",
  "apikey",
  "api_key",
];

/**
 * Returns the URL if it is a safe, public https destination; otherwise null.
 * Empty (TODO) URLs and URLs carrying authentication material are rejected,
 * so neither links nor QR codes can ever point at them.
 */
export function resolvePublicUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") return null;
  if (parsed.username || parsed.password) return null;

  const carriesAuth = (params: URLSearchParams) =>
    [...params.keys()].some((key) => FORBIDDEN_PARAMS.includes(key.toLowerCase()));

  if (carriesAuth(parsed.searchParams)) return null;
  if (parsed.hash.includes("=") && carriesAuth(new URLSearchParams(parsed.hash.slice(1)))) {
    return null;
  }
  return parsed.toString();
}
