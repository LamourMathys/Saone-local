import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-4 bg-[#fff5ea]">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/SaoneLocal.png"
          alt="Saône Local Logo"
          width={80}
          height={80}
          className="object-contain"
          priority
        />
      </Link>

      <button className="flex flex-col justify-between w-13 h-10 bg-[#FACA92] rounded-md p-1.5 active:scale-95 transition-transform">
        <span className="w-full h-1 bg-white rounded-full"></span>
        <span className="w-full h-1 bg-white rounded-full"></span>
        <span className="w-full h-1 bg-white rounded-full"></span>
      </button>
    </header>
  );
}
