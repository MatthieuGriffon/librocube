import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

export interface Book {
  id: string;
  titre: string;
  auteur: string;
  genre: string;
  note: string;
  commentaire: string;
  dateEmprunt: string;
  date_lecture: string;
  date_achat: string;
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

const Livres: React.FC = () => {
  const { isAuthenticated, userId } = useAuth(); // Assurez-vous que `userId` est disponible via `useAuth`
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [livres, setLivres] = useState<Book[]>([]);
  const token = localStorage.getItem("token");
  console.log("Current userId from context:", userId);

  const fetchLivres = useCallback(() => {
    console.log("Fetching books with token:", token, "and userId:", userId);
    if (token && userId) {
      console.log(`URL: http://localhost:3000/users/${userId}/books`); // Ajoute ceci pour vérifier l'URL formée
      fetch(`http://localhost:3000/api/user/${userId}/books`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch books");
          }
          return response.json();
        })
        .then((data) => {
          setLivres(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des livres:", error);
          console.error("Response status:", error.response?.status);
          console.error("Response error:", error.response?.data);
        });
    } else {
      console.log("Token or userId missing");
    }
  }, [token, userId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchLivres();
    }
  }, [isAuthenticated, navigate, fetchLivres]);

  if (loading) {
    return <div>Loading...</div>;
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
                <td className="px-1 py-1 text-xs md:text-base">{livre.note}</td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.commentaire}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {formatDate(livre.date_achat)}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {formatDate(livre.date_lecture)}
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
