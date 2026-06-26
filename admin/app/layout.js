import "./globals.css";

export const metadata = {
  title: "Admin Panel — Adventure Holiday Destination",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
