'use client';

import ExportCSV from '@/app/components/ExportCSV';
import { fetchUsers } from '@/services/servicesUsers';
import { getRecentOrders } from '../actions/order';

export default function ExportButtons() {
  const fetchUsersCSV = async () => {
    const users = await fetchUsers();
    return users.map((u) => ({
      Prénom: u.name?.split(' ')[0] ?? '',
      Nom: u.name?.split(' ')[1] ?? '',
      Email: u.email,
      Rôle: u.role,
    }));
  };

  const fetchOrdersCSV = async () => {
    const orders = await getRecentOrders(1000);
    return orders.map((o) => ({
      ID: o.id,
      Date: new Date(o.createdAt).toLocaleDateString('fr-FR'),
      Client: `${o.user.firstname} ${o.user.lastname}`,
      Email: o.user.email,
      Produit: o.product.name,
      Quantité: o.quantity,
      'Total (€)': o.totalPrice.toFixed(2),
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <ExportCSV
        label="Utilisateurs CSV"
        filename="utilisateurs.csv"
        fetchData={fetchUsersCSV}
      />
      <ExportCSV
        label="Commandes CSV"
        filename="commandes.csv"
        fetchData={fetchOrdersCSV}
      />
    </div>
  );
}
