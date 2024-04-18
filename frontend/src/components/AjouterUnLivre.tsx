import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

interface Genre {
  id: string;
  nom: string;
}

interface FormState {
  titre: string;
  auteur: string;
  genre_id: string;
  date_achat: string;
  date_lecture: string;
  commentaire: string;
  note: number;
}

const AjouterUnLivre: React.FC = () => {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [formData, setFormData] = useState<FormState>({
    titre: "",
    auteur: "",
    genre_id: "",
    date_achat: "",
    date_lecture: "",
    commentaire: "",
    note: 0,
  });
  const token = localStorage.getItem("token");

  const fetchGenres = useCallback(async () => {
    if (token) {
      const response = await fetch("http://localhost:3000/genres", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGenres(data);
      } else {
        console.error("Failed to fetch genres");
      }
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setLoading(false);
      fetchGenres();
    }
  }, [isAuthenticated, navigate, fetchGenres]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      const response = await fetch("http://localhost:3000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Book added successfully", result);
        navigate("/books");
      } else {
        console.error("Failed to add book");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h3 className="text-2xl font-bold text-center mb-4">
        Ajouter un Nouveau Livre
      </h3>
      <div className="bg-white shadow-lg rounded-lg p-4 m-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Titre du livre */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="titre"
            >
              Titre du livre
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="titre"
              name="titre"
              type="text"
              value={formData.titre}
              onChange={handleInputChange}
              placeholder="Titre du livre"
            />
          </div>

          {/* Nom de l'auteur */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="auteur"
            >
              Nom de l'auteur
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="auteur"
              name="auteur"
              type="text"
              value={formData.auteur}
              onChange={handleInputChange}
              placeholder="Nom de l'auteur"
            />
          </div>

          {/* Genre */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="genre"
            >
              Genre
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="genre_id"
              name="genre_id"
              value={formData.genre_id}
              onChange={handleInputChange}
            >
              <option value="">Choisissez un genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Date d'achat */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date_achat"
            >
              Date d'achat
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date_achat"
              name="date_achat"
              type="date"
              value={formData.date_achat}
              onChange={handleInputChange}
            />
          </div>

          {/* Date de lecture */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date_lecture"
            >
              Date de lecture
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date_lecture"
              name="date_lecture"
              type="date"
              value={formData.date_lecture}
              onChange={handleInputChange}
            />
          </div>

          {/* Commentaire */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="commentaire"
            >
              Commentaire
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="commentaire"
              name="commentaire"
              value={formData.commentaire}
              onChange={handleInputChange}
              placeholder="Ajoutez un commentaire..."
            ></textarea>
          </div>

          {/* Note */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="note"
            >
              Note
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="note"
              name="note"
              type="number"
              min="0"
              max="10"
              value={formData.note}
              onChange={handleInputChange}
            />
          </div>

          {/* Bouton pour soumettre le formulaire */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AjouterUnLivre;
