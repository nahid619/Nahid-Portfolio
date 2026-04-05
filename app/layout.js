// app/layout.js
import { Poppins } from "next/font/google";
import AuthProvider from "./AuthProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Nahid Hasan — Portfolio",
  description:
    "Salesforce Technical Consultant & QA Automation Engineer. Hands-on experience in Flow Builder automation, end-to-end QA testing, and API testing.",
  openGraph: {
    title: "Nahid Hasan - Portfolio",
    url: "https://nahid-hasan-00619.vercel.app/",
    type: "website",
  },
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