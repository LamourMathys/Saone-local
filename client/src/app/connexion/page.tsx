"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://saone-local.webhop.me/api";

export default function ConnexionPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

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
          setShowPopup(true);
        }
      } catch (err) {
        // Échec silencieux
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF5EA] px-4 relative">
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#FC9E3D] p-6 rounded-2xl shadow-2xl max-w-sm w-full text-white space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold uppercase tracking-wide">
                ATTENTION !
              </h2>
              <p className="text-lg font-bold leading-snug">
                Vous êtes déjà connecté.
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => router.push("/")}
                className="px-8 py-2 bg-white text-[#714143] font-medium rounded-xl hover:bg-[#FFF5EA] transition duration-200 shadow-sm"
              >
                accueil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}