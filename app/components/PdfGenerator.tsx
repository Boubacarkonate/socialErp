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
    <div>
      <button onClick={generatePDF} disabled={loading}>
        {loading ? 'Chargement...' : 'Télécharger la Facture'}
      </button>
    </div>
  );
}
