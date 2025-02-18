const features = [
    { title: "Gestion des utilisateurs", description: "Ajoutez, modifiez et gérez facilement vos équipes." },
    { title: "Planification optimisée", description: "Créez et gérez vos plannings en quelques clics." },
    { title: "Catalogue produit", description: "Suivez vos stocks et facilitez les ventes en ligne." },
  ];
  
  export default function Features() {
    return (
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-bold text-center">Pourquoi choisir notre application ?</h2>
        <div className="mt-8 flex flex-wrap justify-center">
          {features.map((feature, index) => (
            <div key={index} className="m-4 p-6 w-80 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  