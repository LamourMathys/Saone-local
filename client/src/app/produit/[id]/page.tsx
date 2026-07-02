"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Open_Sans } from "next/font/google";
import BoxandBouton from "../../../components/boxandbouton-component/boxandbouton";
import ProductCard from "../../../components/productcard/card";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface ProductData {
  id: number;
  product_name: string;
  price: number;
  unit: string;
  product_photo?: string;
  description?: string;
  producer_id: number;
}

interface ProducerData {
  id: number;
  first_name: string;
  last_name: string;
  business_name?: string;
}

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [producer, setProducer] = useState<ProducerData | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && resJson.data) {
          setProduct(resJson.data);
          const currentProducerId = resJson.data.producer_id;

          if (currentProducerId) {
            fetch(`/api/producers`)
              .then((res) => res.json())
              .then((prodJson) => {
                if (prodJson.success && Array.isArray(prodJson.data)) {
                  const currentProducer = prodJson.data.find(
                    (p: any) => String(p.id) === String(currentProducerId),
                  );
                  if (currentProducer) setProducer(currentProducer);
                }
              })
              .catch(console.error);

            fetch(`/api/products?producerId=${currentProducerId}`)
              .then((res) => res.json())
              .then((productsJson) => {
                if (productsJson.success && Array.isArray(productsJson.data)) {
                  const others = productsJson.data.filter(
                    (p: any) => String(p.id) !== String(params.id),
                  );
                  setSuggestedProducts(others.slice(0, 3));
                }
              })
              .catch(console.error);
          }
        }
      })
      .catch(console.error);
  }, [params?.id]);

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  return (
    <main
      className={`${openSans.className} w-full min-h-screen bg-[#FAF6F0] p-4 flex flex-col gap-6`}
    >
      <BoxandBouton
        text="produit"
        boxColor="bg-[#8B362E]"
        buttonColor="bg-[#8B362E]"
      />

      <div className="flex gap-4 items-start w-full">
        <div className="w-[45%] flex flex-col gap-3 shrink-0">
          <div className="w-full aspect-square rounded-xl overflow-hidden relative">
            <Image
              src={product.product_photo || "/productplaceholder.png"}
              alt={product.product_name}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>

          <div className="bg-white rounded-xl p-3 flex flex-col gap-1 w-full text-[10px] font-bold text-[#9AA433]">
            <h3 className="border-b border-gray-100 pb-0.5 mb-0.5">
              Caractéristiques:
            </h3>
            {producer && (
              <>
                <p>
                  Producteur :{" "}
                  <Link
                    href={`/producteur/${producer.id}`}
                    className="underline hover:opacity-80"
                  >
                    {producer.first_name} {producer.last_name}
                  </Link>
                </p>
                {producer.business_name && (
                  <p>
                    Entreprise :{" "}
                    <span className="font-bold">{producer.business_name}</span>
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0 pt-1 text-[#8B362E]">
          <div className="flex justify-between items-start gap-1 w-full">
            <h1 className="text-lg font-bold leading-tight">
              {product.product_name}
            </h1>
            <button className="text-gray-400 text-lg shrink-0">☆</button>
          </div>

          <p className="text-[10px] opacity-90 leading-tight">
            {product.description}
          </p>

          <div className="mt-2">
            <p className="text-base font-bold">
              {formattedPrice}/{product.unit}
            </p>
            <p className="text-[8px] opacity-80 leading-tight mt-0.5">
              TVA 5,5% incluse
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-[#9AA433]">
            <span>Qté</span>
            <div className="flex items-center bg-white rounded-lg px-2 py-0.5 text-gray-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-[#9AA433] text-xs px-1"
              >
                -
              </button>
              <span className="px-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-[#9AA433] text-xs px-1"
              >
                +
              </button>
            </div>
            <span className="text-[9px] font-semibold">En stock</span>
          </div>

          <button className="bg-white text-[10px] font-medium py-1.5 px-4 rounded-lg active:scale-95 transition-transform w-fit mt-3">
            → Ajouter au panier
          </button>
        </div>
      </div>

      {suggestedProducts.length > 0 && (
        <section className="w-full flex flex-col gap-3 mt-4">
          <h2 className="text-sm font-bold text-[#8B362E]">
            Ça pourrait vous intéresser :
          </h2>

          <div className="grid grid-cols-3 gap-2 w-full mt-8">
            {suggestedProducts.map((suggested) => (
              <ProductCard
                key={suggested.id}
                product={{
                  id: suggested.id,
                  name: suggested.product_name,
                  price: suggested.price,
                  unit: suggested.unit,
                  product_photo:
                    suggested.product_photo || "/productplaceholder.png",
                  producer_id: suggested.producer_id,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
