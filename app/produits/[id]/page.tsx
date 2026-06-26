import { getOneProduct } from "@/app/actions/products";
import ProductDetail from "@/app/components/ProductDetail";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getOneProduct(parseInt(id, 10));

  if (!product) {
    return {
      title: "Produit introuvable",
      description: "Ce produit n'existe pas ou a été supprimé.",
    };
  }

  const image = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://social-erp.vercel.app";
  const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  return {
    title: `${product.name} — Social ERP`,
    description: product.description || `Découvrez ${product.name} à ${product.price} €`,
    openGraph: {
      title: product.name,
      description: product.description || `${product.name} — ${product.price} €`,
      images: [{ url: imageUrl, width: 800, height: 600, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `${product.name} — ${product.price} €`,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetail id={parseInt(id, 10)} />;
}
