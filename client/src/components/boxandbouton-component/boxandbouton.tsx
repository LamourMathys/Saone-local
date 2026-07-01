import BeigeButton from "../bbutton-component/boutonbeige";
import Box from "../boxreglable-component/box";
import { Baloo_2 } from "next/font/google";

const baloo2 = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface ProfileHeaderProps {
  text: string;
  boxColor?: string;
  buttonColor?: string;
}

export default function BoxandBouton({
  text,
  boxColor,
  buttonColor,
}: ProfileHeaderProps) {
  return (
    <div
      className={`${baloo2.className} flex justify-between items-center mb-4 w-full`}
    >
      <BeigeButton bgColor={buttonColor} />
      <Box text={text} bgColor={boxColor} />
    </div>
  );
}

// Changer le texte, la couleur de la box et la couleur du bouton de retour
/**<BoxandBouton 
  text="producteur" 
  boxColor="bg-[#FACA92]" 
  buttonColor="bg-[#FACA92]" 
/>**/
