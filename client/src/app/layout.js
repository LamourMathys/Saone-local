import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header-component/header";
import NavBar from "../components/navbar-component/navbar";
import Footer from "../components/footer-component/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Saone-local",
  description: "Marketplace en Saone-et-Loire",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-[#fff5ea] min-h-full flex flex-col">
        <Header />
        {children}
        <NavBar />
        <Footer />
      </body>
    </html>
  );
}
