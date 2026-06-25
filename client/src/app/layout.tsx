"use client";

import { Baloo_2 } from "next/font/google";
import { useState } from "react";
import "./globals.css";
import Header from "../components/header-component/header";
import NavBar from "../components/navbar-component/navbar";
import Footer from "../components/footer-component/footer";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
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
        className={`${baloo.className} bg-[#fdfaf5] text-stone-800 min-h-screen flex flex-col m-0 p-0`}
      >
        <Header setActiveTab={setActiveTab} />

        <main className="w-full min-h-[92vh]">{children}</main>

        <Footer />

        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </body>
    </html>
  );
}
