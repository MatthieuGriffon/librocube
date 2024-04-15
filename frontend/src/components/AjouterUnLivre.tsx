import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

interface Genre {
  id: string;
  nom: string;
}

const AjouterUnLivre: React.FC = () => {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const token = localStorage.getItem("token");

  const fetchGenres = useCallback(async () => {
    if (token && userId) {
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
  }, [token, userId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setLoading(false);
      fetchGenres();
    }
  }, [isAuthenticated, navigate, fetchGenres]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h3 className="text-2xl font-bold text-center mb-4">
        Ajouter un Nouveau Livre
      </h3>
      <div className="bg-white shadow-lg rounded-lg p-4 m-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
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
              type="text"
              placeholder="Titre du livre"
            />
          </div>
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
              type="text"
              placeholder="Nom de l'auteur"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="genre"
            >
              Genre
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="genre"
            >
              <option value="">Choisissez un genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.nom}
                </option>
              ))}
            </select>
          </div>
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
