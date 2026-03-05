import "./globals.css";

export const metadata = {
  title: "Mission AI — Freedom Console",
  description: "Create missions with AI assistance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
