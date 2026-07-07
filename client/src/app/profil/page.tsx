"use client";

import { useState, useEffect, useRef } from "react";
import BoxandBouton from "../../components/boxandbouton-component/boxandbouton";
import SuggestedProducts from "../../components/suggested-products/suggestion";
import ProducerProfileProduct from "../../components/productor-profile-product/ProducerProfileProduct";
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

  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    async function loadProfileAndData() {
      try {
        const profileRes = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
        if (!profileRes.ok) return router.push("/connexion");

        const profileData = await profileRes.json();
        if (!profileData.success) return router.push("/connexion");

        const currentUser = profileData.user;
        setUser(currentUser);
        setEditFirstName(currentUser.first_name || "");
        setEditLastName(currentUser.last_name || "");
        setEditDescription(currentUser.description || "");

        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        const rawProducts = Array.isArray(productsData.data) ? productsData.data : Array.isArray(productsData) ? productsData : [];

        if (currentUser.role === "producer") {
          const ordersRes = await fetch("/api/orders/producer", { credentials: "include" });
          const ordersData = await ordersRes.json();
          if (ordersData.success) setOrders(ordersData.orders || []);

          const producersRes = await fetch("/api/producers");
          const producersData = await producersRes.json();
          if (producersData.success && Array.isArray(producersData.data)) {
            const currentProducer = producersData.data.find(
              (p: any) => String(p.user_id) === String(currentUser.id)
            );
            if (currentProducer) {
              setCatalogue(
                rawProducts.filter(
                  (p: DBProduct) => String(p.producer_id) === String(currentProducer.id)
                )
              );
            }
          }
        } else {
          const ordersRes = await fetch("/api/orders/user", { credentials: "include" });
          const ordersData = await ordersRes.json();
          if (ordersData.success) setOrders(ordersData.orders || []);
          setSuggestions(rawProducts.slice(0, 3));
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadProfileAndData();
  }, [router]);

  const handleSaveChanges = async () => {
    if (!user) return;
    try {
      const formData = new FormData();
      formData.append("first_name", editFirstName);
      formData.append("last_name", editLastName);
      formData.append("description", editDescription);
      if (selectedFile) formData.append("user_photo", selectedFile);

      const res = await fetch(`/api/users/${user.id}`, { method: "PUT", body: formData });
      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
        setIsEditing(false);
        setSelectedFile(null);
      } else {
        alert(json.error || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getImagePath = () => {
    if (!user?.user_photo) return "/placeholder.png";
    if (user.user_photo.startsWith("http")) return user.user_photo;

    const cleanPath = user.user_photo.replace(/^\/?(uploads\/avatars\/)?/, "");
    return `/uploads/avatars/${cleanPath}`;
  };

  if (!user) return null;

  const isProducer = user.role === "producer";
  const activeOrders = orders.filter(o => o.status !== "terminée" && o.status !== "livrée");
  const pastOrders = orders.filter(o => o.status === "terminée" || o.status === "livrée");

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#714143] p-4 pb-24">
      <BoxandBouton text="votre profil" boxColor="bg-[#FACA92]" buttonColor="bg-[#FACA92]" />

      {isEditing ? (
        <div className="bg-white rounded-2xl p-4 mt-4 mb-4 flex flex-col gap-4 border border-[#FACA92]/30">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#714143]">Modifier votre profil :</h3>
            <button 
              onClick={() => {
                setIsEditing(false);
                setSelectedFile(null);
                setEditFirstName(user.first_name || "");
                setEditLastName(user.last_name || "");
                setEditDescription(user.description || "");
              }}
              className="text-xs text-stone-400 underline"
            >
              annuler
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              <div className="border border-[#FACA92] rounded-xl p-2.5 bg-white flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-[#FACA92] uppercase">nom :</span>
                <input 
                  type="text" 
                  value={editFirstName} 
                  onChange={(e) => setEditFirstName(e.target.value)} 
                  className="text-xs font-bold text-[#714143] bg-stone-50 p-1.5 rounded outline-none w-full"
                  placeholder="Prénom"
                />
                <input 
                  type="text" 
                  value={editLastName} 
                  onChange={(e) => setEditLastName(e.target.value)} 
                  className="text-xs font-bold text-[#714143] bg-stone-50 p-1.5 rounded outline-none w-full"
                  placeholder="Nom"
                />
              </div>

              <div className="border border-[#FACA92] rounded-xl p-2.5 bg-white flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-[#FACA92] uppercase self-start">image :</span>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#FACA92] text-white text-[10px] font-bold py-2 px-2 rounded-lg w-full text-center"
                >
                  {selectedFile ? "sélectionnée" : "ajouter"}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                />
              </div>
            </div>

            <div className="border border-[#FACA92] rounded-xl p-2.5 bg-white flex flex-col">
              <span className="text-[10px] font-bold text-[#FACA92] uppercase mb-1">description :</span>
              <textarea 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)} 
                className="text-xs text-[#714143] bg-transparent outline-none resize-none flex-1 w-full leading-relaxed"
                placeholder="Votre description..."
              />
            </div>
          </div>

          <button 
            onClick={handleSaveChanges}
            className="border-2 border-[#FACA92] bg-white text-[#714143] text-xs font-bold py-2 px-8 rounded-xl mx-auto"
          >
            continuer
          </button>
        </div>
      ) : (
        <div className="flex gap-4 items-center mt-4 mb-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-200">
            <Image
              src={getImagePath()} 
              alt="Profil"
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#714143] truncate">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-xs text-[#714143] opacity-80 line-clamp-2 italic mt-0.5">
              {user.description || (isProducer ? "Producteur Saône Local." : "Client Saône Local.")}
            </p>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-[11px] text-[#714143] underline font-medium mt-1 self-start"
            >
              modifier
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#9AA433] text-white rounded-xl p-4 mb-4">
        <h3 className="font-bold text-base mb-2">Commandes :</h3>
        <div className="flex flex-col gap-2 text-xs">
          {(isProducer ? orders : activeOrders).length === 0 ? (
            <p className="italic opacity-80">Aucune commande en cours.</p>
          ) : (
            (isProducer ? orders : activeOrders).map((order) => (
              <div key={order.id} className="flex justify-between items-center border-b border-white/10 pb-1 last:border-0">
                <span className="font-bold">n° {order.id}</span>
                <span className="truncate max-w-30">
                  {isProducer 
                    ? `${order.client_first_name || "Client"} ${order.client_last_name || ""}` 
                    : new Date(order.created_at).toLocaleDateString("fr-FR")
                  }
                </span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {!isProducer ? (
        <>
          <div className="bg-[#8B362E] text-white rounded-xl p-4 mb-4">
            <h3 className="font-bold text-base mb-2">Votre historique :</h3>
            <div className="flex flex-col gap-2 text-xs">
              {pastOrders.length === 0 ? (
                <p className="italic opacity-80">Votre historique d&#39;achats est vide.</p>
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
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-lg text-[#714143]">Votre catalogue :</h4>
          </div>
          
          {catalogue.length === 0 ? (
            <p className="text-xs italic text-[#714143] opacity-70">Aucun produit en vente.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {catalogue.map((prod) => (
                <ProducerProfileProduct
                  key={prod.id}
                  id={prod.id}
                  name={prod.product_name}
                  photoUrl={prod.product_photo}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <button 
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
          router.push("/connexion");
        }}
        className="mt-10 text-xs text-red-500 underline block mx-auto hover:text-red-600 transition-colors"
      >
        Se déconnecter de la session
      </button>
    </main>
  );
}