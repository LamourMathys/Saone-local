"use client";

import ProductCard from "../productcard/card";

interface SuggestedProduct {
  id: number;
  product_name: string;
  price: number;
  unit: string;
  product_photo?: string;
  producer_id: number;
}

interface SuggestedProductsProps {
  products: SuggestedProduct[];
}

export default function SuggestedProducts({ products }: SuggestedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-3 mt-4">
      <h2 className="text-sm font-bold text-[#8B362E]">
        Ça pourrait vous intéresser :
      </h2>

      <div className="grid grid-cols-3 gap-2 w-full mt-8"> 
        {products.map((suggested) => (
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
  );
}