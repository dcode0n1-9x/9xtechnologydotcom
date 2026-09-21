import { UserPlus } from "lucide-react";
import { card } from "@/app/_config/card";

export function SaveContactButton() {
  const { contact } = card;
  return (
    <a href={contact.vcard} download={contact.filename} type={contact.mime} className="btn-accent w-full">
      <UserPlus className="size-5" aria-hidden="true" />
      {contact.cta}
    </a>
  );
}
