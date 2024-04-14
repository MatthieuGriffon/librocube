import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

const AjouterUnLivre: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-4xl mx-auto p-5">
      <h3 className="text-2xl font-bold text-center mb-4">
        Ajouter un Nouveau Livre
      </h3>
      <div className="bg-white shadow-lg rounded-lg p-4 m-4">
        <form className="flex flex-col">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 md:p-2"
              htmlFor="titre"
            >
              Titre du livre
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:p-2"
              id="titre"
              type="text"
              placeholder="Titre du livre"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 md:p-2"
              htmlFor="auteur"
            >
              Nom de l'auteur
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:p-2"
              id="auteur"
              type="text"
              placeholder="Nom de l'auteur"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 md:p-2"
              htmlFor="sous-genre"
            >
              Genre
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:p-2"
              id="sous-genre"
              defaultValue=""
            >
              <option value="" disabled>
                Choisissez un genre
              </option>
              {/* Genre Argumentatif */}
              <optgroup label="Genre Argumentatif">
                <option value="essai">Essai</option>
                <option value="pamphlet">Pamphlet</option>
                <option value="fable">Fable</option>
              </optgroup>

              {/* Genre Narratif */}
              <optgroup label="Genre Narratif">
                <option value="apologue">Apologue</option>
                <option value="autobiographie">Autobiographie</option>
                <option value="biographie">Biographie</option>
                <option value="chronique">Chronique</option>
                <option value="conte">Conte</option>
                <option value="journal">Journal</option>
                <option value="legende">Légende</option>
                <option value="mythe">Mythe</option>
                <option value="nouvelle">Nouvelle</option>
                <option value="roman">Roman</option>
              </optgroup>

              {/* Genre Poétique */}
              <optgroup label="Genre Poétique">
                <option value="ballade">Ballade</option>
                <option value="chanson">Chanson</option>
                <option value="fatrasie">Fatrasie</option>
                <option value="ode">Ode</option>
                <option value="epopee">Épopée</option>
              </optgroup>

              {/* Genre Théâtral */}
              <optgroup label="Genre Théâtral">
                <option value="comedie">Comédie</option>
                <option value="drame">Drame</option>
                <option value="farce">Farce</option>
                <option value="moralite">Moralité</option>
                <option value="tragedie">Tragédie</option>
              </optgroup>
              <option value="autre">Autre</option>
            </select>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline md:px-8 md:py-4"
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
