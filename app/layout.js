import './globals.css';

export const metadata = {
  title: 'Nahid Hasan',
  description: 'Salesforce Technical Consultant & QA Automation Engineer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}