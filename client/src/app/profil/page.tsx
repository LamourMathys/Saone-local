"use client";

import { useState, useEffect } from "react";
import BoxandBouton from "../../components/boxandbouton-component/boxandbouton";
import SuggestedProducts from "../../components/suggested-products/suggestion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "client" | "producer" | "admin";
  description?: string;
  user_photo?: string;
}

interface Order {
  id: number;
  created_at: string;
  status: string;
  total_price: number;
  user_id: number;
  producer_id: number;
  client_first_name?: string;
  client_last_name?: string;
}

interface DBProduct {
  id: number;
  producer_id: number;
  category_id: number;
  product_name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  product_photo?: string;
}

export default function ProfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suggestions, setSuggestions] = useState<DBProduct[]>([]);
  const [catalogue, setCatalogue] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadProfileAndData() {
      try {
        const profileRes = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", 
        });

        if (!profileRes.ok) {
          router.push("/connexion");
          return;
        }

        const profileData = await profileRes.json();
        if (!profileData.success) {
          router.push("/connexion");
          return;
        }

        const currentUser = profileData.user;
        setUser(currentUser);

        if (currentUser.role === "producer") {
          const ordersRes = await fetch("/api/orders/producer", { credentials: "include" });
          const ordersData = await ordersRes.json();
          if (ordersData.success) setOrders(ordersData.orders || []);

          const productsRes = await fetch("/api/products");
          const productsData = await productsRes.json();
          
          const rawProducts = Array.isArray(productsData.products)
            ? productsData.products
            : Array.isArray(productsData)
            ? productsData
            : [];

          setCatalogue(rawProducts.filter((p: DBProduct) => String(p.producer_id) === String(currentUser.id)));
        } else {
          const ordersRes = await fetch("/api/orders/user", { credentials: "include" });
          const ordersData = await ordersRes.json();
          if (ordersData.success) setOrders(ordersData.orders || []);

          const productsRes = await fetch("/api/products");
          const productsData = await productsRes.json();
          
          const rawProducts = Array.isArray(productsData.products)
            ? productsData.products
            : Array.isArray(productsData)
            ? productsData
            : [];

          setSuggestions(rawProducts.slice(0, 3));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfileAndData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6EE]">
        <p className="text-[#6F4444] animate-pulse font-medium">Chargement...</p>
      </div>
    );
  }

  if (!user) return null;

  const isProducer = user.role === "producer";

  const activeOrders = orders.filter(o => o.status !== "terminée" && o.status !== "livrée");
  const pastOrders = orders.filter(o => o.status === "terminée" || o.status === "livrée");

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#6F4444] p-4 pb-28">
      <BoxandBouton
        text="votre profil"
        boxColor="bg-[#FACA92]"
        buttonColor="bg-[#FACA92]"
      />

      <div className="flex gap-4 items-start mt-6 mb-6">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-stone-200 border border-stone-300">
          <Image
            src={user.user_photo || "/placeholder.png"} 
            alt="Profil"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed italic">
            {user.description || (isProducer ? "Producteur Saône Local." : "Client Saône Local.")}
          </p>
          <button className="bg-white border text-xs px-3 py-1 rounded-lg w-max mt-3 hover:bg-stone-50 active:scale-95 transition-transform">
            modifier
          </button>
        </div>
      </div>

      <div className="bg-[#9AA03A] text-white rounded-2xl p-4 mb-4 shadow-sm">
        <h3 className="font-bold text-lg mb-2">Commandes :</h3>
        <div className="flex flex-col gap-2 text-sm font-medium">
          {(isProducer ? orders : activeOrders).length === 0 ? (
            <p className="text-xs opacity-90 italic">Aucune commande en cours.</p>
          ) : (
            (isProducer ? orders : activeOrders).map((order) => (
              <div key={order.id} className="flex justify-between border-b border-white/10 pb-1 last:border-0">
                <span>n° {order.id}</span>
                <span>
                  {isProducer 
                    ? `${order.client_first_name || "Client"} ${order.client_last_name || ""}` 
                    : new Date(order.created_at).toLocaleDateString("fr-FR")
                  }
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {!isProducer ? (
        <>
          <div className="bg-[#6F4444] text-white rounded-2xl p-4 mb-6 shadow-sm">
            <h3 className="font-bold text-lg mb-2">Votre historique :</h3>
            <div className="flex flex-col gap-2 text-sm opacity-90">
              {pastOrders.length === 0 ? (
                <p className="text-xs italic opacity-80">Votre historique d&lsquo;achats est vide.</p>
              ) : (
                pastOrders.map((o) => (
                  <div key={o.id} className="flex justify-between">
                    <span>n° {o.id}</span>
                    <span>{new Date(o.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <SuggestedProducts products={suggestions} />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3 mt-6">
            <h4 className="font-bold text-xl">Votre catalogue :</h4>
            <button className="bg-[#FACA92] text-white w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">➔</button>
          </div>
          
          {catalogue.length === 0 ? (
            <p className="text-sm italic text-stone-500">Aucun produit en vente.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {catalogue.map((prod) => (
                <div key={prod.id} className="flex flex-col gap-1 items-center">
                  <div className="relative w-full h-24 rounded-2xl overflow-hidden shadow-sm border bg-white">
                    <Image 
                      src={prod.product_photo || "/productplaceholder.png"} 
                      alt={prod.product_name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <span className="text-[10px] text-center font-bold bg-white px-2 py-0.5 rounded-full shadow-xs border line-clamp-1 w-full">
                    {prod.product_name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button 
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
          router.push("/connexion");
        }}
        className="mt-12 text-xs text-red-400 underline block mx-auto hover:text-red-600 transition-colors"
      >
        Se déconnecter de la session
      </button>
    </main>
  );
}