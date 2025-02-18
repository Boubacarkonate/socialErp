'use client';
import React, { createContext, ReactNode, useContext, useState } from "react";

type ProductsType = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantityProduct: number;
};

interface ProductsContextType {
  listProduit: ProductsType[]; // Ajout pour exposer la liste des produits
  addToCart: (product: ProductsType) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

interface ProductProviderProps {
  children: ReactNode;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [listProduit, setListProduit] = useState<ProductsType[]>([]);

  // Ajouter un produit au panier
  const addToCart = (product: ProductsType) => {
    const existingProductIndex = listProduit.findIndex((element) => element.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedProduct = [...listProduit];
      updatedProduct[existingProductIndex].quantityProduct += 1;
      setListProduit(updatedProduct);
    } else {
      setListProduit([...listProduit, { ...product, quantityProduct: 1 }]);
    }
  };

  // Décrémenter la quantité
  const decrementQuantity = (productId: number) => {
    const updatingProduct = listProduit
      .map((element) =>
        element.id === productId
          ? element.quantityProduct > 1
            ? { ...element, quantityProduct: element.quantityProduct - 1 }
            : null
          : element
      )
      .filter((element) => element !== null) as ProductsType[];
    setListProduit(updatingProduct);
  };

  // Incrémenter la quantité
  const incrementQuantity = (productId: number) => {
    setListProduit((prevListProducts) =>
      prevListProducts.map((element) =>
        element.id === productId ? { ...element, quantityProduct: element.quantityProduct + 1 } : element
      )
    );
  };

  // Retirer un produit du panier
  const removeFromCart = (productId: number) => {
    setListProduit(listProduit.filter((element) => element.id !== productId));
  };

  // Vider le panier
  const clearCart = () => {
    setListProduit([]);
  };

  return (
    <ProductsContext.Provider
      value={{ listProduit, addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

// Hook pour utiliser le contexte des produits
export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProductsContext must be used within a ProductsProvider");
  }
  return context;
};
