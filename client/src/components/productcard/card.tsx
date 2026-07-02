import Image from "next/image";
import Link from "next/link";

interface ProductData {
  id: number;
  name?: string;
  product_name?: string;
  price: number;
  unit: string;
  product_photo?: string;
  producer_id: number;
}

interface ProductCardProps {
  product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  return (
    <Link
      href={`/produit/${product.id}`}
      className="w-full bg-transparent flex flex-col gap-1"
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden relative shrink-0">
        <Image
          src={product.product_photo || "/placeholder.png"}
          alt="Produit"
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </div>

      <div className="bg-[#8B362E] rounded-xl p-2 flex flex-col justify-between gap-2 text-white">
        <div>
          <h3 className="text-xs font-bold leading-tight truncate">
            {product.product_name || product.name}
          </h3>
          <p className="text-[10px] font-normal opacity-90 mt-0.5 truncate">
            {formattedPrice} ({product.unit})
          </p>
        </div>

        <button
          onClick={(e) => e.preventDefault()}
          className="w-full bg-white text-[#8B362E] font-medium text-[10px] py-1 rounded-lg active:scale-95 transition-transform text-center"
        >
          Ajouter au panier
        </button>
      </div>
    </Link>
  );
}