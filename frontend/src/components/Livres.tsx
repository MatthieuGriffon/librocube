import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

const Livres: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  console.log("Authentifié:", isAuthenticated);

  // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [livres] = useState<any[]>([
    {
      titre: "Les Ombres du Passé",
      auteur: "Julien Mercier",
      genre: "Fiction",
      status: "Lu",
      dateEmprunt: "2020-01-01",
      dateLecture: "2020-02-01",
      commentaire: "Intrigue captivante du début à la fin.",
      note: "⭐⭐⭐⭐⭐",
    },
    {
      titre: "Au-delà des Étoiles",
      auteur: "Clara Fontaine",
      genre: "Science",
      status: "Non Lu",
      dateEmprunt: "2021-01-01",
      dateLecture: "",
      commentaire: "Hâte de le commencer, recommandé par un ami.",
      note: "⭐⭐⭐",
    },
    {
      titre: "Héritage d'un Empire",
      auteur: "Marc Dubois",
      genre: "Histoire",
      status: "Lu",
      dateEmprunt: "2020-03-15",
      dateLecture: "2020-04-10",
      commentaire:
        "Une perspective fascinante sur des événements historiques clés.",
      note: "⭐⭐⭐⭐",
    },
    {
      titre: "Voix Silencieuses",
      auteur: "Sophie Laurent",
      genre: "Biographie",
      status: "En cours",
      dateEmprunt: "2021-05-21",
      dateLecture: "2021-06-01",
      commentaire:
        "Inspiration pure. La vie de cette personnalité est incroyable.",
      note: "⭐⭐⭐⭐⭐",
    },
    {
      titre: "Le Gardien des Secrets",
      auteur: "Émilie Rivière",
      genre: "Fantasy",
      status: "Lu",
      dateEmprunt: "2019-12-25",
      dateLecture: "2020-01-20",
      commentaire:
        "Un monde riche et immersif. Un peu long à certains moments.",
      note: "⭐⭐⭐⭐",
    },
  ]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);
  if (loading) {
    return null;
  }
  return (
    <div className="flex max-w-6xl mx-auto flex-col">
      <h2 className="text-1xl font-bold mb-2 text-center p-2 md:text-2xl">
        Ma bibliothèque
      </h2>
      <div className="overflow-x-auto w-full relative table-scroll-indicator">
        <table className="min-w-full">
          <thead className="bg-gray-200 text-sm">
            <tr className="text-center">
              <th className="px-1 py-1 text-xs md:text-base">Titre</th>
              <th className="px-1 py-1 text-xs md:text-base">Auteur</th>
              <th className="px-1 py-1 text-xs md:text-base">Genre</th>
              <th className="px-1 py-1 text-xs md:text-base">Note</th>
              <th className="px-1 py-1 text-xs md:text-base">Commentaires</th>
              <th className="px-1 py-1 text-xs md:text-base">Emprunté</th>
              <th className="px-1 py-1 text-xs md:text-base">Status</th>
              <th className="px-1 py-1 text-xs md:text-base">Lu le</th>
            </tr>
          </thead>
          <tbody>
            {livres.map((livre, index) => (
              <tr key={index} className="border-b text-center md:text-base">
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.titre}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.auteur}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.genre}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {/* Ici tu peux mettre une représentation visuelle des étoiles */}
                  ⭐ ⭐
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.commentaire}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.dateEmprunt}
                </td>

                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.status}
                </td>

                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.dateLecture}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Livres;
