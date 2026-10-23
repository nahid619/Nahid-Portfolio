// app/opengraph-image.js
//
// The share card LinkedIn, WhatsApp, Slack and X show when someone pastes
// the portfolio link. Before this file there was no og:image at all, so
// previews were a bare text link.
//
// Generated once at build time (no database call), so it can't fail on a
// cold start. If the headline changes, edit the strings below.
// Poppins (SIL Open Font License) is embedded as .woff because the image
// renderer can't read .woff2.

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Nahid Hasan — Salesforce Technical Consultant and Certified Agentforce Specialist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME     = "Nahid Hasan";
const ROLE     = "Salesforce Technical Consultant";
const CREDENTIAL = "Certified Agentforce Specialist";

export default async function Image() {
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Poppins-Bold.woff")),
    readFile(join(process.cwd(), "assets/fonts/Poppins-Regular.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#011428",
          borderLeft: "16px solid #059212",
          fontFamily: "Poppins",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
          {NAME}
        </div>
        <div style={{ marginTop: 18, fontSize: 40, color: "#bcc4ba" }}>
          {ROLE}
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignSelf: "flex-start",
            padding: "12px 24px",
            borderRadius: 10,
            border: "2px solid #059212",
            color: "#9BEC00",
            fontSize: 30,
          }}
        >
          {CREDENTIAL}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Poppins", data: bold,    weight: 700, style: "normal" },
        { name: "Poppins", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
