

"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getAllProducts } from "../actions/products";

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const StockProduct = () => {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      const data = await getAllProducts();
      setStock(data);
    };

    fetchStock();
  }, []);

  // Vérification si les données sont vides
  if (stock.length === 0) return <p>Chargement des données...</p>;

  // Données du graphique
  const data = {
    labels: stock.map((el) => el.name), // Noms des produits
    datasets: [
      {
        label: "Stock des produits",
        data: stock.map((el) => el.stock), // Quantités en stock
        borderColor: "#D97706", // Ambre foncé pour la ligne
        backgroundColor: "rgba(254, 243, 199, 0.5)", // Ambre clair avec opacité pour le remplissage
        borderWidth: 3, // Légèrement plus épais pour un look premium
        tension: 0.4, // Courbe fluide
        pointRadius: 6, // Points légèrement plus grands pour la visibilité
        pointBackgroundColor: "#FBBF24", // Doré doux pour les points
        pointBorderColor: "#92400E", // Brun foncé pour un contraste subtil
        fill: true, // Remplissage activé
      },
    ],
  };
  

  // Options du graphique
  const options = {
    responsive: true,
    plugins: {
      // title: {
      //   display: true,
      //   text: "Stock des Produits",
      //   font: { size: 18 },
      // },
      legend: {
        display: true, // Afficher la légende
        position: "top",
        labels: { color: "#F3F4F6" }, // Légende en blanc cassé
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantité en stock",
        },
        ticks: { color: "#F3F4F6" }, // Texte en blanc cassé
      grid: { color: "rgba(243, 244, 246, 0.2)" }, // Grille discrète
      },
      x: {
        // title: {
        //   display: true,
        //   text: "Produits",
        // },
        ticks: { color: "#F3F4F6" }, // Texte en blanc cassé
      grid: { color: "rgba(243, 244, 246, 0.2)" }, // Grille discrète
      },
    },
  };

  return (
    <div>
     
      <Line data={data} options={options} width={400} height={280}/>
    </div>
  );
};

export default StockProduct;
