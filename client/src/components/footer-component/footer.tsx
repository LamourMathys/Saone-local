import Link from "next/link";
import Image from "next/image";

export default function Footer({ isLoggedIn = false, hideAuthLinks = false }) {
  return (
    <footer className="w-full pt-10 pb-20 px-10">
      <div className="grid grid-cols-2 gap-y-5 gap-x-10 text-[15px] font-medium">
        <div className="space-y-4">
          
          {!hideAuthLinks && (
            isLoggedIn ? (
              <Link href="/profil" className="block hover:underline">
                mon profil
              </Link>
            ) : (
              <Link href="/connexion" className="block hover:underline">
                se connecter
              </Link>
            )
          )}

          <Link href="/favoris" className="block hover:underline">
            favoris
          </Link>
          <Link href="/panier" className="block hover:underline">
            panier
          </Link>
          <Link href="/calendrier" className="block hover:underline">
            calendrier
          </Link>
          <Link href="/catalogue" className="block hover:underline">
            catalogue
          </Link>
          <Link href="/association" className="block hover:underline">
            plus sur l&lsquo;asso
          </Link>
        </div>

        <div className="space-y-4">
          <Link href="/mentions-legales" className="block hover:underline">
            mentions légales
          </Link>
          <Link href="/contact" className="block hover:underline">
            contact
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-row items-center justify-center gap-3">
        <div className="relative w-20 h-20">
          <Image
            src="/fabrique-en-bourgogne.png"
            alt="Label Fabriqué en Bourgogne"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-sm font-medium">Fabriqué en Bourgogne</span>
      </div>
    </footer>
  );
}