interface DemoCredentials {
  accountId: string;
  password: string;
  server: string;
}

/** Clipboard payload for the full demo credential set. Omits the password when unavailable. */
export function formatCredentials({ accountId, password, server }: DemoCredentials): string {
  const lines = [`Account: ${accountId}`];
  if (password) lines.push(`Password: ${password}`);
  lines.push(`Server: ${server}`);
  return lines.join("\n");
}
