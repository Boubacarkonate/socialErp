import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className='flex items-center justify-center flex-col w-full h-screen bg-gradient-to-r from-blue-500 to-teal-500'>
        <h1 className='m-2 text-2xl'>Page de connexion</h1>
             <div className="mt-6 p-4 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-xl font-semibold">Identifiants de test :</h2>
        <p className="text-gray-700">Admin : admin@test.com / Password: PasswordAdmin1234</p>
        <p className="text-gray-700">Team : team@test.com / Password: PasswordTeam1234</p>
        <p className="text-gray-700">User : user@test.com / Password: PasswordUser1234</p>
      </div>
        <SignIn />
    </div>
  );
}