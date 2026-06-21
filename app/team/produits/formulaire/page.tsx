import CreateProduct from "@/app/components/CreateProduct";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreationProduct() {
  return (
    <div className="p-6">
      <Link
        href="/team/produits"
        className="inline-flex items-center gap-1.5 text-surface-500 hover:text-white text-sm font-medium transition-colors duration-150 group mb-5"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
        Retour aux produits
      </Link>
      <CreateProduct />
    </div>
  );
}
