"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import BoxandBouton from "../../components/boxandbouton-component/boxandbouton";
import CartItem from "../../components/cart-item/CartItem";
import ProductCard from "../../components/productcard/card";

import { useRouter } from "next/navigation";

interface CartItemData {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_photo: string;
  price: number;
  unit: string;
  stock: number;
  producer_id: number;
  business_name: string;
  producer_first_name: string;
  producer_last_name: string;
}

export default function Panier() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchCart = useCallback(() => {
    fetch("/api/orders/cart")
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/connexion");
          return null;
        }
        return res.json();
      })
      .then((resJson) => {
        if (!resJson) return;
        if (resJson.success && Array.isArray(resJson.data)) {
          setCartItems(resJson.data);
        }
      })
      .catch((err) => console.error(err));
  }, [router]);

  useEffect(() => {
    fetchCart();

    fetch("/api/products")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          setSuggestedProducts(resJson.data.slice(0, 3));
        }
      })
      .catch((err) => console.error(err));
  }, [fetchCart]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    try {
      const res = await fetch("/api/orders/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: newQuantity,
        }),
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/connexion");
        return;
      }
      const resJson = await res.json();
      if (resJson.success) {
        fetchCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setIsEditing(false);
      return;
    }

    const deletePromises = selectedIds.map((id) =>
      fetch(`/api/orders/cart/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/connexion");
        }
        return res;
      }).catch((err) => console.error(err))
    );

    await Promise.all(deletePromises);
    setSelectedIds([]);
    setIsEditing(false);
    fetchCart();
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const res = await fetch("/api/orders/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/connexion");
        return;
      }
      const resJson = await res.json();
      if (resJson.success) {
        fetchCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      const res = await fetch("/api/orders/cart/checkout", {
        method: "POST",
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/connexion");
        return;
      }
      const resJson = await res.json();
      if (resJson.success) {
        alert("Votre commande a été enregistrée avec succès !");
        setCartItems([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const formattedSubtotal = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(subtotal);

  return (
    <main className="w-full max-w-107.5 mx-auto min-h-screen bg-[#FAF6F0] pb-28">
      <div className="pt-4 px-4 flex flex-col gap-4">
        <BoxandBouton
          text="votre panier"
          boxColor="bg-[#FACA92]"
          buttonColor="bg-[#FACA92]"
        />

        <div className="flex justify-end w-full mt-2 mb-1">
          {isEditing ? (
            <button
              onClick={handleBulkDelete}
              className="w-8 h-8 bg-[#8B362E] active:scale-90 transition-transform rounded-xl flex items-center justify-center shadow-sm cursor-pointer"
            >
              <Image
                src="/pictos poubelle.png"
                alt="Supprimer"
                width={16}
                height={16}
                className="object-contain brightness-0 invert"
              />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 bg-[#FACA92]/95 active:scale-90 transition-transform rounded-xl flex items-center justify-center shadow-sm cursor-pointer"
            >
              <Image
                src="/pictos crayon.png"
                alt="Modifier"
                width={16}
                height={16}
                className="object-contain"
              />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5 mt-2">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                key={item.order_item_id}
                id={item.product_id}
                name={item.product_name}
                photoUrl={item.product_photo}
                price={item.price}
                unit={item.unit}
                stock={item.stock}
                quantity={item.quantity}
                sellerName={item.business_name || `${item.producer_first_name} ${item.producer_last_name}`}
                isEditing={isEditing}
                isSelected={selectedIds.includes(item.product_id)}
                onSelectToggle={() => toggleSelectItem(item.product_id)}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))
          ) : (
            <div className="text-center py-12 text-[#9c787a] font-medium text-sm">
              Votre panier est vide pour le moment.
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-4 pt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#714143]">Sous-total :</span>
              <span className="text-base font-extrabold text-[#8B362E]">
                {formattedSubtotal}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#8B362E] active:scale-[0.98] transition-transform text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer shadow-sm text-sm"
            >
              <Image
                src="/panier_rempli.png"
                alt="Panier"
                width={18}
                height={18}
                className="object-contain"
              />
              <span>Passer commande →</span>
            </button>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-sm font-bold text-[#8B362E] mb-4">
            Ça pourrait vous intéresser :
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {suggestedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
