'use client';

import { createBuy } from "@/app/actions/order";
import { paymentStripe } from "@/app/actions/stripe";
import { getOneUser } from "@/app/actions/user";
import { useProductsContext } from "@/app/Context/CartContext";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCcAmex, FaCcMastercard, FaCcVisa, FaCreditCard } from 'react-icons/fa';

interface DashboardRole {
  link: string;
}

type RoleDashboard = {
  [K in 'admin' | 'team' | 'user']: DashboardRole;
};

const roleDashBoard: RoleDashboard = {
  admin: { link: "admin" },
  team:  { link: "team" },
  user:  { link: "user" },
};

export default function Header() {
  const { listProduit, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = useProductsContext();
  const totalProductCount = listProduit.reduce((total, el) => total + el.quantityProduct, 0);
  const totalPrice = listProduit.reduce((total, el) => total + el.price * el.quantityProduct, 0);
  const [dataRole, setDataRole] = useState<keyof RoleDashboard | undefined>();
  const { user } = useUser();

  const handleBuy = async () => {
    if (!user?.id) {
      alert("Veuillez vous connecter pour effectuer un achat.");
      return;
    }
    try {
      const dataUser = await getOneUser(user.id);
      if (!dataUser.id) return;
      await Promise.all(
        listProduit.map((product) => createBuy(dataUser.id, product.id, product.quantityProduct))
      );
      const stripeResponse = await paymentStripe({ title: "Achat de produits", price: totalPrice, userId: user.id });
      if (stripeResponse?.url) window.location.href = stripeResponse.url;
      else alert("Une erreur est survenue. Veuillez réessayer.");
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
      alert("Une erreur est survenue pendant la transaction.");
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await getOneUser(user?.id);
        setDataRole(data.role);
      } catch {
        // user not loaded yet
      }
    };
    fetchRole();
  }, [user]);

  return (
    <header className="h-14 border-b border-surface-700/50 bg-surface-900/95 backdrop-blur-sm flex items-center px-4 gap-4 shrink-0 z-40">
      {/* Logo / Brand */}
      <Link href="/" className="flex items-center gap-2 mr-2 shrink-0">
        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center shadow-brand">
          <span className="text-white text-xs font-bold">S</span>
        </div>
        <span className="text-white font-semibold text-sm hidden sm:block">Social ERP</span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1">
        <Link
          href="/"
          className="px-3 py-1.5 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg text-sm font-medium transition-all duration-150 hidden sm:block"
        >
          Accueil
        </Link>
        <Link
          href="/produits"
          className="px-3 py-1.5 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg text-sm font-medium transition-all duration-150 hidden sm:block"
        >
          Produits
        </Link>
        {dataRole && roleDashBoard[dataRole] && (
          <Link
            href={`/${roleDashBoard[dataRole].link}`}
            className="px-3 py-1.5 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg text-sm font-medium transition-all duration-150 hidden sm:block"
          >
            Dashboard
          </Link>
        )}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Cart button */}
        <button
          onClick={() => document.getElementById("my_modal_4")?.showModal()}
          className="relative flex items-center justify-center w-9 h-9 bg-surface-800 hover:bg-surface-700 border border-surface-700 hover:border-surface-600 text-surface-300 hover:text-white rounded-lg transition-all duration-150"
          aria-label="Panier"
        >
          <ShoppingCart size={16} />
          {totalProductCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalProductCount}
            </span>
          )}
        </button>

        {/* Auth */}
        {!user ? (
          <SignInButton>
            <button className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-brand">
              Connexion
            </button>
          </SignInButton>
        ) : (
          <UserButton />
        )}
      </div>

      {/* Cart modal */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-4xl bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl relative p-0 overflow-hidden">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <ShoppingCart size={18} className="text-brand-400" />
              Votre Panier
              {totalProductCount > 0 && (
                <span className="badge-brand">{totalProductCount} article{totalProductCount > 1 ? "s" : ""}</span>
              )}
            </h3>
            <form method="dialog">
              <button className="w-8 h-8 flex items-center justify-center bg-surface-700 hover:bg-surface-600 text-surface-300 hover:text-white rounded-lg transition-all duration-150">
                <X size={16} />
              </button>
            </form>
          </div>

          <div className="flex gap-0">
            {/* Items */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
              {listProduit.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingCart size={40} className="text-surface-600 mb-4" />
                  <p className="text-surface-400 font-medium">Votre panier est vide</p>
                  <p className="text-surface-500 text-sm mt-1">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {listProduit.map((element) => (
                    <div key={element.id} className="flex items-center gap-4 bg-surface-900/50 border border-surface-700/50 p-4 rounded-xl">
                      <Image
                        src={element.image}
                        width={60}
                        height={60}
                        alt={element.name}
                        className="rounded-lg object-contain bg-surface-800 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{element.name}</p>
                        <p className="text-brand-400 font-bold text-sm mt-0.5">{element.price} €</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrementQuantity(element.id)}
                          className="w-7 h-7 flex items-center justify-center bg-surface-700 hover:bg-surface-600 text-surface-300 hover:text-white rounded-md transition-all duration-150"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white font-semibold text-sm w-5 text-center">{element.quantityProduct}</span>
                        <button
                          onClick={() => incrementQuantity(element.id)}
                          className="w-7 h-7 flex items-center justify-center bg-surface-700 hover:bg-surface-600 text-surface-300 hover:text-white rounded-md transition-all duration-150"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeFromCart(element.id)}
                          className="w-7 h-7 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-md transition-all duration-150 ml-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {listProduit.length > 0 && (
              <div className="w-64 p-6 border-l border-surface-700 bg-surface-900/50 flex flex-col">
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Résumé</h4>
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Livraison</span>
                    <span className="text-accent-400 font-semibold">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-surface-700 pt-3 mt-3">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-white font-bold text-base">{totalPrice} €</span>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleBuy}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-brand hover:shadow-glow text-sm"
                  >
                    Payer maintenant
                    <div className="flex items-center justify-center gap-2 mt-1.5 opacity-70">
                      <FaCreditCard className="text-sm" />
                      <FaCcVisa className="text-sm" />
                      <FaCcMastercard className="text-sm" />
                      <FaCcAmex className="text-sm" />
                    </div>
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors text-center"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </header>
  );
}
