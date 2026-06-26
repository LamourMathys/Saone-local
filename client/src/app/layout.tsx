"use client";

import { Open_Sans } from "next/font/google";
import { useState } from "react";
import "./globals.css";
import Header from "../components/header-component/header";
import NavBar from "../components/navbar-component/navbar";
import Footer from "../components/footer-component/footer";

const openSans = Open_Sans({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("");

  return (
    <html lang="fr">
      <body
        className={
          "${openSans.className} min-h-screen flex flex-col m-0 p-0 text-[#714143]"
        }
      >
        <Header setActiveTab={setActiveTab} />

        <main className="w-full min-h-[92vh]">{children}</main>

        <Footer />

        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </body>
    </html>
  );
}
