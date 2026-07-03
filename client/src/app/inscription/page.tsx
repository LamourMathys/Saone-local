"use client";

import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "../../components/boxandbouton-component/boxandbouton";
import { Baloo_2, Open_Sans } from "next/font/google";

const baloo2 = Baloo_2({ subsets: ["latin"], weight: ["400", "700"] });
const openSans = Open_Sans({ subsets: ["latin"], weight: ["500"] });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function Inscription() {
  const router = useRouter();
  const [role, setRole] = useState<"client" | "producteur">("client");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      if (role === "producteur") {
        router.push(`/inscription/producteur?userId=${data.user.id}`);
      } else {
        router.push("/connexion");
      }
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
          Inscrivez - vous !
        </h1>

        <p
          className={`${openSans.className} text-center text-[#714143] text-sm mb-5`}
        >
          Qui êtes - vous ?
        </p>

        <div className="flex justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`h-12 px-6 rounded-xl text-sm ${role === "client" ? "bg-white" : "bg-white/50"}`}
          >
            client
          </button>
          <button
            type="button"
            onClick={() => setRole("producteur")}
            className={`h-12 px-6 rounded-xl text-sm ${role === "producteur" ? "bg-white" : "bg-white/50"}`}
          >
            producteur
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="h-14 bg-white rounded-xl px-4 w-full"
          />
          <input
            type="text"
            placeholder="prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="h-14 bg-white rounded-xl px-4 w-full"
          />
          <input
            type="email"
            placeholder="adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-14 bg-white rounded-xl px-4 w-full"
          />
          <input
            type="password"
            placeholder="mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            {loading ? "Inscription..." : "continuer"}
          </button>
        </form>
      </div>
    </main>
  );
}
