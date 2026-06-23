import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full">
      <div className="relative w-full aspect-3/1">
        <Image
          src="/banniere-SaoneLocal.svg"
          alt="Label Fabriqué en Bourgogne"
          fill
          priority
          className="object-contain"
        />
      </div>
    </main>
  );
}
