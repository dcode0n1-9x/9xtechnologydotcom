/**
 * Single source of truth for all business content.
 * Components must never hard-code names, URLs, credentials or copy.
 *
 * Empty-string URLs are stakeholder TODOs — the UI renders an
 * "unavailable" state for them. Never invent a destination.
 */

const telegram = "adamken0007";

export const card = {
  site: {
    // Canonical/OG base URL comes from deployment config, never hard-coded.
    url:
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : ""),
    title: "Hemant — CTO @ 9xTechnology | Digital Executive Card",
    description:
      "9xTechnology Digital Executive Card — contact Hemant, download the trading app, open the client portal and try an instant demo account.",
    ogImage: "/9xtechnology-og.png",
    ogImageAlt: "9xTechnology — Trading Infrastructure",
    appName: "9xTechnology Digital Card",
    shortName: "9xTechnology",
    manifestDescription: "9xTechnology Digital Executive Card",
  },

  icons: {
    favicon: "/9xTechnology/favicon.ico",
    favicon16: "/9xTechnology/favicon-16x16.png",
    favicon32: "/9xTechnology/favicon-32x32.png",
    appleTouch: "/9xTechnology/apple-touch-icon.png",
    android192: "/9xTechnology/android-chrome-192x192.png",
    android512: "/9xTechnology/android-chrome-512x512.png",
  },

  person: {
    name: "Hemant",
    title: "CTO @ 9xTechnology",
    role: "CTO",
    organization: "9xTechnology",
    initials: "H",
    portrait: "/img/HemantPhoto.png",
    portraitPosition: "70% 30%",
    portraitAlt: "Portrait of Hemant, CTO of 9xTechnology",
    telegram,
    telegramUrl: `https://t.me/${telegram}`,
  },

  brand: {
    name: "9xTechnology",
    tagline: "Trading Infrastructure",
    logo: "/9xTechnology/android-chrome-192x192.png",
    logoAlt: "9xTechnology",
    statusLabel: "9X NODES ACTIVE",
    appBarTitle: "Digital Card",
    notificationsLabel: "Notifications (coming soon)",
  },

  intro: {
    brand: "9X TECHNOLOGY",
    tagline: "TRADING INFRASTRUCTURE",
    access: "INSTITUTIONAL ACCESS",
    motto: "PRECISION. LIQUIDITY. EXECUTION.",
    steps: ["INITIALIZING", "LOADING CARD", "READY"],
    skipLabel: "Skip intro",
  },

  telegramCard: {
    heading: "Telegram",
    openCta: "Open Telegram",
    copyLabel: "Copy Telegram handle",
    toastLabel: "Telegram handle",
  },

  apps: {
    heading: "Trading App",
    version: "v4.2 PRO",
    subtitle: "Download the trading app",
    ios: {
      store: "App Store",
      badgeTop: "Download on the",
      url: "https://apps.apple.com/us/app/global-apex-markets/id6773324199",
      qrLabel: "QR code for downloading the 9xTechnology iOS application",
    },
    android: {
      store: "Google Play",
      badgeTop: "Get it on",
      url: "https://play.google.com/store/apps/details?id=com.ninextechnology.globalapexmarkets",
      qrLabel: "QR code for downloading the 9xTechnology Android application",
    },
  },

  crm: {
    portal: {
      title: "Client Portal",
      copy: "Manage your trading account, multi-currency wallets, and instant withdrawals.",
      cta: "Open Portal",
      url: "https://wallet.fxcapital24.com",
      qrLabel: "QR code for opening the 9xTechnology Client Portal",
      demoCredentials: {
        tag: "DEMO ACCESS",
        email: {
          label: "Email",
          value: "demouser@gmail.com",
          copyLabel: "Copy client portal email",
        },
        password: {
          label: "Password",
          value: "Demouser@123",
          copyLabel: "Copy client portal password",
        },
      },
    },
    admin: {
      title: "Admin Dashboard",
      // PRD copy — kept verbatim ("route routing" flagged for stakeholder review).
      copy: "Brokerage liquidity route routing, compliance, and user telemetry console.",
      cta: "Open Dashboard",
      badge: "RESTRICTED",
      url: "https://admin.fxcapital24.com",
      qrLabel: "QR code for opening the 9xTechnology Admin Dashboard login",
      demoCredentials: {
        tag: "DEMO ACCESS",
        email: {
          label: "User / Email",
          value: "GlobalApexAdmin",
          copyLabel: "Copy admin dashboard user",
        },
        password: {
          label: "Password",
          value: "GlobalApex@123",
          copyLabel: "Copy admin dashboard password",
        },
      },
    },
  },

  demo: {
    heading: "Demo Sandbox",
    tag: "LIVE INSTANT ACCESS",
    accountId: "77777",
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "Test@12345",
    passwordUnavailable: "Request from CTO",
    server: "9xTechnology-Demo01",
    labels: {
      accountId: "Account ID",
      password: "Password",
      server: "Server",
    },
    copyLabels: {
      accountId: "Copy account ID",
      password: "Copy password",
      server: "Copy server",
    },
    copyAllCta: "Copy credentials",
    toastLabel: "Credentials",
  },

  contact: {
    cta: "Save Contact",
    vcard: "/hemant.vcf",
    filename: "Hemant-9xTechnology.vcf",
    mime: "text/vcard",
  },

  install: {
    cta: "Install 9xTechnology",
    iosHint: "On iPhone: tap Share, then “Add to Home Screen”.",
  },

  ui: {
    unavailable: "Coming soon",
    copied: "copied",
    copyFailed: "Couldn't copy — long-press to select",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },

  legal:
    "© 9xTechnology • INSTITUTIONAL GRADE — High-performance liquidity & institutional trading infrastructure.",
} as const;

export type Card = typeof card;
