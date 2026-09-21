interface VCardPerson {
  name: string;
  role: string;
  organization: string;
  telegram: string;
  telegramUrl: string;
}

function escape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/([,;])/g, "\\$1");
}

/**
 * Builds the vCard 3.0 text for a person. Phase 1 ships the result as the
 * static `public/hemant.vcf`; a test keeps that file in sync with config.
 * Phase 2 can serve this from `/api/vcard` without changing callers.
 */
export function buildVCard(person: VCardPerson): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${escape(person.name)};;;`,
    `FN:${escape(person.name)}`,
    `ORG:${escape(person.organization)}`,
    `TITLE:${escape(person.role)}`,
    `URL:${person.telegramUrl}`,
    `X-SOCIALPROFILE;TYPE=telegram:${person.telegramUrl}`,
    `NOTE:Telegram @${escape(person.telegram)}`,
    "END:VCARD",
    "",
  ].join("\r\n");
}
