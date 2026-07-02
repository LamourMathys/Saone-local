"use client";

import ProfileHeader from "../../../../components/boxandbouton-component/boxandbouton";

interface UserData {
  id: number;
  name: string;
  price: number;
  unit: string;
  product_photo?: string;
  producer_id: number;
}

export default function Profil() {
  return (
    <main className="w-full">
      <div className="pt-4 px-4">
        <ProfileHeader
          text="compte"
          boxColor="bg-[#FACA92]"
          buttonColor="bg-[#FACA92]"
        />
      </div>
    </main>
  );
}
