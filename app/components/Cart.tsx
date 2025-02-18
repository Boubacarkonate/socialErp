'use client';

import { useProductsContext } from '@/app/Context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { listProduit, incrementQuantity, decrementQuantity, removeFromCart } = useProductsContext();
  const totalProductCount = listProduit.reduce((total, element) => total + element.quantityProduct, 0);
  const totalPrice = listProduit.reduce((total, element) => total + element.price * element.quantityProduct, 0);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      router.push('/checkout'); // Redirect to checkout page
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Erreur lors de la redirection au paiement.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Votre Panier</h1>
      {listProduit.length === 0 ? (
        <p className="text-center text-lg">Votre panier est vide.</p>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            {listProduit.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-white p-4 shadow rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={product.image}
                    width={100}
                    height={100}
                    alt={product.name}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="text-lg font-semibold">{product.name}</p>
                    <p className="text-gray-600">Prix : {product.price} €</p>
                    <p className="text-gray-600">Quantité : {product.quantityProduct}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                    onClick={() => decrementQuantity(product.id)}
                  >
                    -
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                    onClick={() => incrementQuantity(product.id)}
                  >
                    +
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold">Résumé</h2>
            <p className="mt-2 text-lg">Articles : {totalProductCount}</p>
            <p className="mt-2 text-lg">Total : {totalPrice} €</p>
            <button
              onClick={handleCheckout}
              className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-500"
            >
              Passer au paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}