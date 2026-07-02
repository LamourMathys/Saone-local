"use client";

import { useState, useEffect, SyntheticEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "../../components/boxandbouton-component/boxandbouton";
import { Baloo_2 } from "next/font/google";

const baloo2 = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://saone-local.webhop.me/api";

export default function Connexion() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const skipCheck = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (skipCheck.current) return;
      try {
        const res = await fetch(`${API_URL}/refresh`, {
          method: "POST",
          credentials: "include",
        });

        const text = await res.text();
        const data = text.startsWith("{") ? JSON.parse(text) : null;

        if (res.ok && data && data.success && !skipCheck.current) {
          window.location.href = "/";
        }
      } catch (err) {
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Erreur de connexion");
        setLoading(false);
        return;
      }

      skipCheck.current = true;
      
      window.location.href = "/";
    } catch (err) {
      setError("Impossible de contacter le serveur.");
      setLoading(false);
    }
  };

  return (
    <main className="w-full relative min-h-[80vh]">
      <div className="pt-4 px-4">
        <ProfileHeader
          text="compte"
          boxColor="bg-[#FACA92]"
          buttonColor="bg-[#FACA92]"
        />

        <h1
          className={`${baloo2.className} text-center text-2xl font-bold text-[#9AA433] mt-10 mb-8`}
        >
          Bon retour parmi nous !
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 px-6 text-color"
        >
          <input
            type="email"
            placeholder="adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-16 bg-white rounded-xl p-4 w-full"
          />
          <input
            type="password"
            placeholder="mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-16 bg-white rounded-xl p-4 w-full"
          />

          {error && (
            <p className="text-[#BF4035] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-16 bg-white rounded-xl p-2 w-full font-medium disabled:opacity-50"
          >
            {loading ? "Connexion..." : "continuer"}
          </button>
        </form>

        <p
          className={`${baloo2.className} text-center font-bold text-[#9AA433] my-6`}
        >
          ou
        </p>

        <div className="text-center">
          <p className="text-[#714143]">Pas de compte ? Inscrivez-vous !</p>
          <a href="/inscription" className="underline text-[#5C3A2E]">
            s&apos;inscrire
          </a>
        </div>
      </div>
    </main>
  );
}