"use client";

import Image from "next/image";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface ProducersCardProps {
  name: string;
  firstname: string;
  lastname: string;
  photoUrl: string;
}

export default function HomeProducerCard({
  name,
  firstname,
  lastname,
  photoUrl,
}: ProducersCardProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div
        style={{
          width: "100%",
          height: "135px",
          borderRadius: "24px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Image
          src={photoUrl || "/placeholder.png"}
          alt={name || "Producteur"}
          fill
          unoptimized
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      <h2
        className={openSans.className}
        style={{
          margin: 0,
          fontSize: "8px",
          fontWeight: "400",
          color: "#714143",
        }}
      >
        {firstname} {lastname}
      </h2>

      <p
        className={openSans.className}
        style={{
          margin: 0,
          fontWeight: "400",
          fontSize: "8px",
          color: "#714143",
        }}
      >
        {name}
      </p>
    </div>
  );
}
