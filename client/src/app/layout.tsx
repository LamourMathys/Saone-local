"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
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

export default function RootLayout({ children }) {
  const [activeTab, setActiveTab] = useState("");

  return (
    <html lang="fr">
      <body className="bg-[#fdfaf5] text-stone-800 min-h-screen flex flex-col m-0 p-0">
        <Header setActiveTab={setActiveTab} />

        <main className="w-full min-h-[92vh]">{children}</main>

        <Footer />

        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </body>
    </html>
  );
}
