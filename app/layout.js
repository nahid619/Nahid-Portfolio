// app/layout.js
import { Poppins } from "next/font/google";
import AuthProvider from "./AuthProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// metadataBase turns relative URLs (og:url, the generated og:image) into
// absolute ones, which LinkedIn / WhatsApp / Slack previews require.
// The old og:url pointed at nahid-hasan-00619.vercel.app — the previous
// static site — so shared links previewed the wrong domain.
// Set NEXT_PUBLIC_SITE_URL in Vercel if you add a custom domain.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://nahidhasan00619.vercel.app");

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nahid Hasan — Salesforce Technical Consultant",
  description:
    "Salesforce Technical Consultant and Certified Agentforce Specialist. Flow Builder automation, Apex, LWC, end-to-end QA and API testing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}