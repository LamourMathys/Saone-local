import Image from "next/image";
import Link from "next/link";

interface ProducerData {
  id: number;
  first_name: string;
  last_name: string;
  user_photo?: string;
}

interface ProducerCardProps {
  producer: ProducerData;
}

export default function ProducerCard({ producer }: ProducerCardProps) {
  const fullName = `${producer.first_name} ${producer.last_name}`;

  return (
    <Link
      href={`/producteur/${producer.id}`}
      className="w-full bg-transparent flex flex-col gap-1"
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden relative shrink-0">
        <Image
          src={producer.user_photo || "/placeholder.png"}
          alt={fullName}
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </div>

      <div className="bg-[#8B362E] rounded-xl p-2 flex flex-col justify-between gap-2 text-white">
        <div>
          <h3 className="text-xs font-bold leading-tight truncate">
            {fullName}
          </h3>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-white text-[#8B362E] font-medium text-[10px] py-1 rounded-lg active:scale-95 transition-transform text-center"
        >
          Voir plus
        </button>
      </div>
    </Link>
  );
}
