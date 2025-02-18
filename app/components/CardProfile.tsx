'use client';

import Image from "next/image";
import FormUpdate from "./FormUpdate";

interface UserProps {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
}

const CardProfile = ({ id, name, email, photo, role }: UserProps) => {
  return (
    <div className="flex w-full justify-center items-center flex-col">
      <h1 className="text-2xl mb-2 font-bold">Profil</h1>
      <Image src={photo} alt="Avatar profil" height={150} width={150} />
      <p><strong>Nom:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>ID (BDD):</strong> {id}</p>
      <p><strong>Rôle:</strong> {role}</p>
      <FormUpdate />
    </div>
  );
};

export default CardProfile;
