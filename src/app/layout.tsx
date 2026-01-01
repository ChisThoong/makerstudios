import type { Metadata } from "next";
import "./globals.css";
import { gilroy, bebas } from './fonts'
import Header from "./components/layout/header";
import FollowCursor from "./components/ui/follow-cursor";
import ScrollAnimationProvider from "./components/ui/scroll-animation-provider";
import Footer from "./components/layout/footer";
import { LanguageProvider } from "./context/language-context";

export const metadata: Metadata = {
  title: "Maker Studios",
  description: "We make games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${gilroy.variable} ${bebas.variable}`}>
      <body className={gilroy.className}>
        <LanguageProvider>
          <ScrollAnimationProvider />
          <FollowCursor />
          <Header />
          <main> 
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}