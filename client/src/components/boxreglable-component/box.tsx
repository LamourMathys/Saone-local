interface BadgeProps {
  text: string;
  bgColor?: string;
}

export default function Box({ text, bgColor = "bg-[#FACA92]" }: BadgeProps) {
  return (
    <span
      className={`${bgColor} text-white px-4 py-1.5 rounded-lg text-xs font-bold lowercase tracking-wider`}
    >
      {text}
    </span>
  );
}

// Changer couleur et text
//<Badge text=".." bgColor="bg-[#8B362E]" />
