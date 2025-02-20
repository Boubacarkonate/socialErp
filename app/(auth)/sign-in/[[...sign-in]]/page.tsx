import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className='flex items-center justify-center flex-col w-full h-screen bg-gradient-to-r from-blue-500 to-teal-500'>
        <h1 className='m-4 text-2xl font-bold text-white'>Page de connexion</h1>
        <div className='flex flex-col md:flex-row items-center justify-center gap-6 w-full px-4'>
                <div className="mt-6 p-4 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-xl font-semibold">Identifiants de test :</h2>
        <p >Admin : <span className="font-bold text-gray-950">admin@test.com</span>  / Password:<span className="font-bold text-gray-950">PasswordAdmin1234</span> </p>
        <p >Team : <span className="font-bold text-gray-950">team@test.com </span>/ Password: <span className="font-bold text-gray-950">PasswordTeam1234</span></p>
        <p >User : <span className="font-bold text-gray-950">user@test.com</span> / Password: <span className="font-bold text-gray-950">PasswordUser1234</span></p>
      </div>
        <SignIn />
    </div>
        </div>
       
  );
}