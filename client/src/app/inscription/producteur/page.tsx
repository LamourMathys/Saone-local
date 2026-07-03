"use client";

import { useState, SyntheticEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileHeader from "../../../components/boxandbouton-component/boxandbouton";
import { Baloo_2, Open_Sans } from "next/font/google";

const baloo2 = Baloo_2({ subsets: ["latin"], weight: ["400", "700"] });
const openSans = Open_Sans({ subsets: ["latin"], weight: ["500"] });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function InscriptionProducteurForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [businessName, setBusinessName] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [siret, setSiret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Session invalide, veuillez recommencer l'inscription.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/producers`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          business_name: businessName,
          shop_location: shopLocation,
          siret,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Erreur lors de la création de votre fiche");
        return;
      }
      router.push("/");
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen">
      <div className="pt-4 px-4">
        <ProfileHeader
          text="inscription"
          boxColor="bg-[#FACA92]"
          buttonColor="bg-[#FACA92]"
        />

        <h1
          className={`${baloo2.className} text-center text-xl font-bold text-[#9AA433] mt-8 mb-1`}
        >
          Votre exploitation
        </h1>

        <p
          className={`${openSans.className} text-center text-[#714143] text-sm mb-6`}
        >
          Encore une étape avant de finaliser votre inscription
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="nom de l'exploitation"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className="h-14 bg-white rounded-xl px-4 w-full"
          />
          <input
            type="text"
            placeholder="adresse de la ferme"
            value={shopLocation}
            onChange={(e) => setShopLocation(e.target.value)}
            required
            className="h-14 bg-white rounded-xl px-4 w-full"
          />
          <input
            type="text"
            placeholder="numéro SIRET"
            value={siret}
            onChange={(e) => setSiret(e.target.value)}
            required
            maxLength={14}
            className="h-14 bg-white rounded-xl px-4 w-full"
          />

          {error && (
            <p className="text-[#5C3A2E] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-14 bg-white rounded-xl w-full font-medium disabled:opacity-50 mt-1"
          >
            {loading ? "Création..." : "continuer"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function InscriptionProducteur() {
  return (
    <Suspense fallback={null}>
      <InscriptionProducteurForm />
    </Suspense>
  );
}
