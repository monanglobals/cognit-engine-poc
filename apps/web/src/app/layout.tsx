import './global.css';

export const metadata = {
  title: 'Cognit',
  description: 'Cognit monorepo — web app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
