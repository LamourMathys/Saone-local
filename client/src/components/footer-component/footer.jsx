import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#fff5ea] pb-20 px-10 text-stone-700 ">
      <div className="grid grid-cols-2 gap-y-5 gap-x-10 text-[15px] font-medium">
        <div className="space-y-4">
          <button className="block">se connecter</button>
          <button className="block">favoris</button>
          <button className="block">panier</button>
          <button className="block">calendrier</button>
          <button className="block">catalogue</button>
          <button className="block">plus sur l&lsquo;asso</button>{" "}
          {/* &lsquo; permet d'afficher une citation */}
        </div>
        <div className="space-y-4">
          <button className="block">mentions légales</button>
          <button className="block">contact</button>
        </div>
      </div>

      <div className="mt-8 flex flex-row items-center justify-center gap-3 ">
        <div className="relative w-20 h-20 ">
          <Image
            src="/fabrique-en-bourgogne.png"
            alt="Label Fabriqué en Bourgogne"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-sm font-medium text-stone-500">
          Fabriqué en Bourgogne
        </span>
      </div>
    </footer>
  );
}
