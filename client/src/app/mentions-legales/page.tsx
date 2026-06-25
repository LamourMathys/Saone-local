import Image from "next/image";

export default function Mentions() {
  return <main className="w-full">
              {/* bloc "mention legal" en haut à droite à ajouter */}
              <div className="relative w-full aspect-3/1">
                <Image
                  src="/banniere-SaoneLocal.svg"
                  alt="Label Fabriqué en Bourgogne"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
          <div>
            VOICI DES MAGNIFIQUES MENTIONS LEGALES
          </div>
          </main>;
}
