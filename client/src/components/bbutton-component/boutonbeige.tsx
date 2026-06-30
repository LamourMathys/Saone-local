"use client";

import { useRouter } from "next/navigation";

export default function BeigeButton({
  bgColor = "bg-[#FACA92]",
}: {
  bgColor?: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`${bgColor} w-8 h-8 rounded-xl flex items-center justify-center text-white text-xl font-bold active:scale-95 transition-transform pb-0.5`}
    >
      ←
    </button>
  );
}
