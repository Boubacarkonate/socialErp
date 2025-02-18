'use client';

import { createBuy } from "@/app/actions/order";
import { paymentStripe } from "@/app/actions/stripe";
import { getOneUser } from "@/app/actions/user";
import { useProductsContext } from "@/app/Context/CartContext";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCcAmex, FaCcMastercard, FaCcVisa, FaCreditCard } from 'react-icons/fa';

interface DashboardRole {
  link: string;
  style: string;
}

type RoleDashboard = {
  [K in 'admin' | 'team' | 'user']: DashboardRole;
}

export default function Header() {
  const { listProduit, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = useProductsContext();
  const totalProductCount = listProduit.reduce((total, element) => total + element.quantityProduct, 0);
  const totalPrice = listProduit.reduce((total, element) => total + element.price * element.quantityProduct, 0);
  const [dataRole, setDataRole] = useState<keyof RoleDashboard | undefined>();
  const { user } = useUser();

  const handleBuy = async () => {
    if (!user?.id) {
      console.error("User not logged in!");
      alert("Veuillez vous connecter pour effectuer un achat.");
      return;
    }

    try {
      // 1. Récupérer les informations utilisateur depuis la base de données
      const dataUser = await getOneUser(user.id);
      if (!dataUser.id) {
        console.error("Utilisateur introuvable dans la base de données !");
        return;
      }

      // 2. Créer les commandes dans la base de données
      await Promise.all(
        listProduit.map(async (product) => {
          await createBuy(dataUser.id, product.id, product.quantityProduct);
        })
      );

      // 3. Appeler l'action server pour Stripe
      const stripeResponse = await paymentStripe({
        title: "Achat de produits",
        price: totalPrice,
        userId: user.id,
      });

      // 4. Redirection vers la page Stripe Checkout
      if (stripeResponse?.url) {
        window.location.href = stripeResponse.url;
      } else {
        console.error("Erreur : URL de paiement Stripe introuvable.");
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
      alert("Une erreur est survenue pendant la transaction.");
    }
  };

  useEffect(()=> {
    const fecthDataRoleUser = async () => {
      try {
        const data = await getOneUser(user?.id);
      setDataRole(data.role);
      } catch (error) {
        console.error('utilisateur non récupéré => pas de role pour le dashboard', error);
      }
    } 
    fecthDataRoleUser();
  }, [user]);

  const roleDashBoard: RoleDashboard = {
    admin: {
      link: "admin",
      style: "cursor-pointer hover:text-amber-200 hover:shadow-amber-400 hover:bg-teal-800 hover:scale-105 transition duration-200 transition hidden sm:block"
    },
    team: {
      link: "team",
      style: "cursor-pointer hover:text-purple-200 hover:bg-purple-500 hover:shadow-indigo-500 hover:scale-105 transition duration-200 hidden sm:block"
    },
    user: {
      link: "user",
      style: "cursor-pointer hover:text-blue-700 hover:shadow-gray-400 hover:bg-gray-200 hover:scale-105 transition duration-200 hidden sm:block"
    }
  }

  return (
    <div>
    <nav >
    <ul className="flex justify-evenly items-center list-none pt-1">
      <li><Link href="/"className={`${roleDashBoard[dataRole]?.style}`}>Home</Link></li>
      <li><Link href="/produits" className={`${roleDashBoard[dataRole]?.style}`}>Produits</Link></li>
      <li><Link href={`/${roleDashBoard[dataRole]?.link}`} className={`${roleDashBoard[dataRole]?.style}`}>Dashboard</Link></li>
      <li>
      <button
  onClick={() => document.getElementById("my_modal_4")?.showModal()}
  className="relative bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition shadow-md"
>
  {/* Icône du panier */}
  <ShoppingCart size={16} />

  {/* Badge avec le nombre total de produits */}
  {totalProductCount > 0 && (
    <span className="absolute top-0 -right-4 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {totalProductCount}
    </span>
  )}
</button>
        <dialog id="my_modal_4" className="modal">
  <div className="modal-box w-11/12 max-w-5xl bg-white rounded-lg shadow-lg relative">
    {/* Close Button */}
    <form method="dialog">
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-700 hover:bg-gray-200 rounded-full p-2"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </form>

    {/* Modal Content and Total Section */}
    <div className="flex justify-between gap-6">
      {/* Panier Content */}
      <div className="w-2/3">
        <h3 className="font-bold text-2xl text-center text-gray-800 mb-6">
          Votre Panier
        </h3>

        {listProduit.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Votre panier est vide.</p>
        ) : (
          <div className="space-y-6">
            {listProduit.map((element) => (
              <div
                key={element.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={element.image}
                    width={100}
                    height={100}
                    alt="photo"
                    className="rounded-lg"
                  />
                  <div>
                    <p className="text-lg font-semibold">{element.name}</p>
                    <p className="text-gray-600">Prix : {element.price} €</p>
                    <p className="text-gray-600">Quantité :   <button
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    onClick={() => decrementQuantity(element.id)}
                  >
                    <Minus size={16} />
                  </button> {element.quantityProduct}    <button
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    onClick={() => incrementQuantity(element.id)}
                  >
                    <Plus size={16} />
                  </button> </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
            
                  <button
                    className="px-3 py-2 bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-500 transition hover:text-gray-50"
                    onClick={() => removeFromCart(element.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total and Checkout */}
      <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">Résumé</h3>
        <div className="border-t pt-4 text-lg font-semibold">
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Frais de livraison :</span>
            <span className="font-bold text-green-600">Gratuit</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Total :</span>
            <span className="font-bold">{totalPrice} €</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-500 transition"
        onClick={handleBuy}
      >
        Payer
        <div className="flex items-center justify-center gap-4 mt-2">
          <FaCreditCard title="Visa" className="text-2xl" />
          <FaCcVisa title="Visa" className="text-2xl" />
          <FaCcMastercard title="MasterCard" className="text-2xl" />
          <FaCcAmex title="American Express" className="text-2xl" />
        </div>
      </button>

      <button
        className="font-bold text-red-600"
        onClick={clearCart}
      >
        Vider le panier
      </button>
    </div>
      </div>
    </div>
  </div>
</dialog>

      </li>
     <li className="flex items-center">
  <SignedOut>
    <SignInButton />
  </SignedOut>
  <SignedIn>
    <UserButton />
  </SignedIn>
</li>
</ul>
    </nav>
  </div>
  
  );
}
