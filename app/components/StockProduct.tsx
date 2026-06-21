"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getAllProducts } from "../actions/products";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const StockProduct = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      const data = await getAllProducts();
      setStock(data);
      setLoading(false);
    };
    fetchStock();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (stock.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <TrendingUp size={24} className="text-surface-600 mb-2" />
        <p className="text-surface-400 text-sm">Aucun produit en stock</p>
      </div>
    );
  }

  const chartData = {
    labels: stock.map((el) => el.name),
    datasets: [
      {
        label: "Stock",
        data: stock.map((el) => el.stock),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#818cf8",
        pointBorderColor: "#312e81",
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        borderColor: "rgba(99,102,241,0.3)",
        borderWidth: 1,
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", font: { size: 11 } },
        grid: { color: "rgba(51, 65, 85, 0.5)" },
        border: { color: "transparent" },
      },
      x: {
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          maxRotation: 30,
        },
        grid: { display: false },
        border: { color: "transparent" },
      },
    },
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={14} className="text-brand-400" />
        <span className="text-white text-sm font-semibold">Niveaux de stock</span>
        <span className="badge-brand ml-auto">{stock.length} produits</span>
      </div>
      <div className="flex-1 min-h-0" style={{ height: "200px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StockProduct;
