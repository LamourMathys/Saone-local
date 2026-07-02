import Banniere from "../../components/banniere-component/banniere";
import ProfileHeader from "../../components/boxandbouton-component/boxandbouton";

export default function Contact() {
  return (
    <main className="w-full">
      <div className="pt-4 px-4">
              <ProfileHeader
                text="compte"
                boxColor="bg-[#FACA92]"
                buttonColor="bg-[#FACA92]"
              />
            </div>
      
      <Banniere />

      <div>
        <form className="grid grid-cols-2 gap-6 gap-x-16 px-14 py-20">
          <input
            type="text"
            placeholder="nom :"
            className="h-20 border border-[#FACA92] bg-white rounded-md p-6 w-full"
          ></input>
          <input
            type="text"
            placeholder="prenom :"
            className="h-20 border border-[#FACA92] bg-white rounded-md p-2 w-full"
          ></input>
          <input
            type="text"
            placeholder="email :"
            className="col-span-2 h-20 border border-[#FACA92] bg-white rounded-md p-2 w-full"
          ></input>
          <input
            type="text"
            placeholder="numero de telephone :"
            className="col-span-2 h-20 border border-[#FACA92] bg-white rounded-md p-2 w-full"
          ></input>
          <textarea
            placeholder="message :"
            className="col-span-2 h-20 border border-[#FACA92] bg-white rounded-md p-2 w-full"
          ></textarea>
        </form>
      </div>
    </main>
  );
}
