"use client";

import { Open_Sans } from "next/font/google";
import { useState, useEffect } from "react";
import "./globals.css";
import Header from "../components/header-component/header";
import NavBar from "../components/navbar-component/navbar";
import Footer from "../components/footer-component/footer";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://saone-local.webhop.me/api";

const openSans = Open_Sans({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/refresh`, {
          method: "POST",
          credentials: "include",
        });

        const text = await res.text();
        const data = text.startsWith("{") ? JSON.parse(text) : null;

        if (res.ok && data && data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <html lang="fr">
      <body
        className={`${openSans.className} min-h-screen flex flex-col m-0 p-0 text-[#714143]`}
      >
        <Header setActiveTab={setActiveTab} isLoggedIn={isLoggedIn} />

        <main className="w-full min-h-[92vh]">{children}</main>

        <Footer isLoggedIn={isLoggedIn} />

        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </body>
    </html>
  );
}