import { getOneUser } from "@/app/actions/user";
import DetailFormOneUser from "@/app/components/DetailFormOneUser";
import Historique from "@/app/components/Historique";
import Planning from "@/app/components/Planning";
import Link from "next/link";

type Props = {
  params: { id: string };
};

// Page dynamique pour afficher DetailForm
const UserDetailsPage = async ({ params }: Props) => {
  const { id } = params;
  const userData = await getOneUser(id);

  const roleStyles = {
    admin: "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-700",
    team: "bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-600",
    user: "bg-gray-100 text-gray-900",
  };

  return (
    <div className={`${roleStyles[userData.role]} min-h-screen p-6`}>
      <div>
      

        <div className="flex flex-col flex-1 gap-10">
          {/* Conteneur flex avec justify-between pour espacer FormUser et Planning */}
          <div className="flex justify-between items-center gap-10">
            <DetailFormOneUser params={{ id }} />
            <div className="flex flex-col gap-10 w-full">
              <div>
                {/* Condition pour afficher soit Planning soit Historique */}
                {userData.role === "team" || userData.role === "admin" ? <Planning /> : <Historique />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link href={"/admin/utilisateurs"}>← Retour à la liste des utilisateurs</Link>
    </div>
  );
};

export default UserDetailsPage;
