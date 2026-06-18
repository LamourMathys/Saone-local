import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="fixed bottom-4 left-3 right-3 h-16 rounded-2xl flex items-center justify-center px-4 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#FACA92]/80 backdrop-blur-md" />
      <div className="relative w-full h-full max-h-[60%]">
        <Image
          src="/nav-bar-pictos.svg"
          alt="Navigation"
          fill
          className="object-contain"
          priority
        />
      </div>
    </nav>
  );
}
