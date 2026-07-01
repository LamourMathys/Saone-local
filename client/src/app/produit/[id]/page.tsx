import ProfileHeader from "../../../components/boxandbouton-component/boxandbouton";

export default function produit() {
  return (
    <main className="w-full">
      <div className="pt-4 px-4 flex flex-col gap-4">
        <ProfileHeader
          text="produit"
          boxColor="bg-[#8B362E]"
          buttonColor="bg-[#8B362E]"
        />
      </div>
    </main>
  );
}
