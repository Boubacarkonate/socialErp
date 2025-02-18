import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center flex-col w-full h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600">Accès Restreint 🚫</h1>
        <p className="text-gray-700 mt-4">L'inscription est désactivée. Utilisez uniquement les identifiants de test fournis.</p>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-semibold">Utilisez les identifiants de test :</h2>
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Rôle</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Mot de passe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Admin</td>
                <td className="border border-gray-300 px-4 py-2">admin@example.com</td>
                <td className="border border-gray-300 px-4 py-2">admin123</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Team</td>
                <td className="border border-gray-300 px-4 py-2">team@example.com</td>
                <td className="border border-gray-300 px-4 py-2">team123</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">User</td>
                <td className="border border-gray-300 px-4 py-2">user@example.com</td>
                <td className="border border-gray-300 px-4 py-2">user123</td>
              </tr>
            </tbody>
          </table>
          <p className="text-red-500 mt-2">⚠️ L'inscription est désactivée. Utilisez uniquement ces identifiants.</p>
        </div>

        <Link href="/sign-in">
          <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            🔄 Retourner à la page de connexion
          </button>
        </Link>
      </div>
    </div>
  );
}
