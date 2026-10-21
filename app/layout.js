import './globals.css';

export const metadata = {
  title: 'Tartan Tickets',
  description: 'Find your next campus event.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
