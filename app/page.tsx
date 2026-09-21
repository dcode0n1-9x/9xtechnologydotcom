import { card } from "@/app/_config/card";
import { publicAssetOrNull } from "@/app/_lib/preload";
import { AppBar } from "@/app/_components/AppBar";
import { AppStoreHub } from "@/app/_components/AppStoreHub";
import { CorporateIdentity } from "@/app/_components/CorporateIdentity";
import { CrmCard } from "@/app/_components/CrmCard";
import { DemoSandbox } from "@/app/_components/DemoSandbox";
import { HeroReveal } from "@/app/_components/HeroReveal";
import { InstallPwaButton } from "@/app/_components/InstallPwaButton";
import { LegalFooter } from "@/app/_components/LegalFooter";
import { LuxuryPreloader } from "@/app/_components/LuxuryPreloader";
import { NodesStatusPill } from "@/app/_components/NodesStatusPill";
import { ProfileCard } from "@/app/_components/ProfileCard";
import { SaveContactButton } from "@/app/_components/SaveContactButton";
import { ServiceWorkerRegister } from "@/app/_components/ServiceWorkerRegister";
import { TelegramCard } from "@/app/_components/TelegramCard";
import { ToastProvider } from "@/app/_components/Toast";

export default function Home() {
  const portraitSrc = publicAssetOrNull(card.person.portrait);

  // Section order per AGENTS.md §12. AppBar stays outside the reveal so the
  // logo-flight target never moves while it is being measured.
  const sections = [
    <div key="status" className="flex justify-center">
      <NodesStatusPill />
    </div>,
    <CorporateIdentity key="identity" />,
    <ProfileCard key="profile" portraitSrc={portraitSrc} />,
    <TelegramCard key="telegram" />,
    <AppStoreHub key="apps" />,
    <CrmCard key="portal" id="portal" entry={card.crm.portal} variant="primary" />,
    <CrmCard key="admin" id="admin" entry={card.crm.admin} variant="secondary" />,
    <DemoSandbox key="demo" />,
    <SaveContactButton key="contact" />,
    <InstallPwaButton key="install" />,
    <LegalFooter key="legal" />,
  ];

  return (
    <ToastProvider>
      <div className="page-shell mx-auto w-full max-w-card">
        <AppBar />
        <main className="flex flex-col gap-4 pt-4">
          {sections.map((section, index) => (
            <HeroReveal key={section.key} index={index}>
              {section}
            </HeroReveal>
          ))}
        </main>
      </div>
      <LuxuryPreloader />
      <ServiceWorkerRegister />
    </ToastProvider>
  );
}
