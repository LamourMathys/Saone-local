"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Open_Sans } from "next/font/google";
import ProfileHeader from "../../../components/boxandbouton-component/boxandbouton";
import ProductCard from "../../../components/productcard/card";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface ProducerData {
  id: number;
  business_name: string;
  shop_location: string;
  first_name: string;
  last_name: string;
  user_photo: string;
}

interface ProductData {
  id: number;
  name: string;
  price: number;
  unit: string;
  product_photo?: string;
  producer_id: number;
}

export default function ProducerProfile() {
  const params = useParams();
  const [producer, setProducer] = useState<ProducerData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/producers/${params.id}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) setProducer(resJson.data);
      })
      .catch((err) => console.error(err));

    fetch(`/api/products?producerId=${params.id}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) setProducts(resJson.data);
      })
      .catch((err) => console.error(err));
  }, [params.id]);

  const filteredProducts = products.filter(
    (product) => product.producer_id === Number(params.id),
  );

  return (
    <div className={`${openSans.className} w-full text-[#714143] px-4 pt-4`}>
      <ProfileHeader
        text="producteur"
        boxColor="bg-[#FACA92]"
        buttonColor="bg-[#FACA92]"
      />

      {producer && (
        <section className="flex gap-4 items-start mb-4">
          <div className="w-28 h-28 rounded-3xl overflow-hidden relative shrink-0">
            <Image
              src={producer.user_photo || "/placeholder.png"}
              alt={`${producer.first_name} ${producer.last_name}`}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h1 className="text-xl font-bold text-[#8B362E]">
                {producer.first_name} {producer.last_name}
              </h1>
              <button className="text-2xl text-[#FACA92]">☆</button>
            </div>

            <p className="mt-0.5 text-xs font-bold text-[#9AA433]">
              {producer.business_name}, produit à{" "}
              {producer.shop_location || "Crissey"}
            </p>
          </div>
        </section>
      )}

      <div className="grid grid-cols-3 gap-2 justify-items-center w-full px-2">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
