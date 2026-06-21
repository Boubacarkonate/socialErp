'use client';

import { getUserDetails } from '@/services/servicesUsers';
import { useUser } from '@clerk/nextjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Pour les tableaux
import { useState } from 'react';
import { productsByUser } from '../actions/order';

export default function PdfGenerator() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // Fonction pour générer le PDF
  const generatePDF = async () => {
    if (!user) {
      console.error("Utilisateur non connecté.");
      return;
    }

    setLoading(true);

    try {
      // Récupération des données utilisateur
      const userData = await getUserDetails(user.id); 
      const listOrders = await productsByUser(userData.id);

      // Création d'un document jsPDF
      const doc = new jsPDF();

      // En-tête du PDF
      doc.setFontSize(18);
      doc.text('Facture Client', 10, 10);

      doc.setFontSize(12);
      doc.text(`Date : ${new Date().toLocaleDateString()}`, 10, 30);

      // Génération du tableau avec autoTable
      autoTable(doc, {
        startY: 40,
        head: [['ID Facture', "date d'achat", 'Produit', 'Quantité', 'Prix Total']],
        body: listOrders?.map((item) => [
          item.id,
          item.createdAt.toLocaleDateString(),
          item.product.name,
          item.quantity,
          `${item.totalPrice} €`
        ]),
      });

      // Sauvegarde du PDF
      doc.save(`facture_${user?.id}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={loading}
      className="btn-ghost w-full flex items-center justify-center gap-2 text-xs"
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Génération…
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Télécharger la facture PDF
        </>
      )}
    </button>
  );
}
