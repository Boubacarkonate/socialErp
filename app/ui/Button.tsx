'use client'

import { useRouter } from 'next/navigation';
import React from 'react';

type ButtonProps = {
  onClick: () => void; // La fonction à exécuter lorsqu'on clique sur le bouton
  label?: string;      // Optionnel : Le texte du bouton
  className?: string; // Classe tailwind personnalisée (optionnel)
};

export const ButtonBack = () => {
    const router = useRouter();

    const back = () => {
      router.back();  // Retour en arrière
    };
  return (
    <button className='bg-gray-800 p-2 rounded-lg text-gray-50 hover:bg-gray-400' onClick={back}>retour</button>
  )
}

//BOUTON AVEC PROPS CLASSIQUE (COMME UN OBJET) : props.className, props.onClick, props.label

// export const ButtonActionFunction: React.FC<ButtonProps> = (props) => {
//   return (
//     <button
//       className={props.className} //props style
//       onClick={props.onClick} // Appelle la fonction passée via props
//     >
//       {props.label} {/*props pour affiche le texte du bouton */}
//     </button>
//   );
// };


//BOUTON AVEC PROPS DESTRUCTURES : ({ onClick, label , className}) avec possibilité de mettre des valeurs par défaut

export const ButtonActionFunction: React.FC<ButtonProps> = ({ onClick, label='Cliquer', className = "" }) => {
  return (
    <button
      className={className} //props style
      onClick={onClick} // Appelle la fonction passée via props
    >
      {label} {/*props pour affiche le texte du bouton */}
    </button>
  );
};
