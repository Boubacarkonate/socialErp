import ListProducts from "@/app/components/ListProducts";
import Header from "../components/hearder/Header";

function ListeProduits() {
  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <ListProducts />
    </div>
  );
}

export default ListeProduits;
