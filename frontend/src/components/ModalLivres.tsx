import React, { useState, useEffect } from "react";

export interface Book {
  id: string;
  titre: string;
  auteur: string;
  genre_id: string;
  genre_nom: string;
  note: string;
  commentaire: string;
  dateEmprunt: string;
  date_lecture: string;
  date_achat: string;
}

export interface ModalProps {
  isOpen: boolean;
  book: Book;
  onSave: (bookData: Book) => void;
  onDelete: (bookId: string) => void;
  closeModal: () => void;
  onUpdate: (updatedBook: Book) => void;
}

export interface Genre {
  id: string;
  nom: string;
}

// Fonction pour formater la date pour les inputs de type date
const formatDateForInput = (dateString: string): string => {
  return new Date(dateString).toISOString().split("T")[0];
};

const ModalLivres: React.FC<ModalProps> = ({
  isOpen,
  book,
  onDelete,
  closeModal,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Book>(book);
  const [genres, setGenres] = useState<Genre[]>([]);
  const token = localStorage.getItem("token");
  console.log("Received onUpdate function:", onUpdate);

  // Mettre à jour formData à l'ouverture de la modal ou lorsque le livre change
  useEffect(() => {
    if (isOpen && book) {
      setFormData({
        ...book,
        date_achat: formatDateForInput(book.date_achat), // Format correct pour les inputs de type date
        date_lecture: formatDateForInput(book.date_lecture),
      });
    }
  }, [isOpen, book]);

  // Gérer les changements d'inputs
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    console.log(`Field changed: ${name} - New value: ${value}`); // Diagnostique
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      console.log("Updated formData:", updatedFormData);
      return updatedFormData;
    });
  };

  // Charger les genres à partir du serveur
  useEffect(() => {
    if (token) {
      fetch("http://localhost:3000/genres", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setGenres(data))
        .catch(console.error);
    }
  }, [token]);

  // Sauvegarder les modifications
  const handleSave = async () => {
    const response = await fetch(`http://localhost:3000/api/${book.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedBookData = await response.json();
      onUpdate(updatedBookData.livre);
      closeModal();
    } else {
      console.error("Failed to update the book");
    }
  };
  const handleDelete = () => onDelete(book.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">Éditer le livre</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Titre
          </label>
          <input
            name="titre"
            type="text"
            value={formData.titre}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Auteur
          </label>
          <input
            name="auteur"
            type="text"
            value={formData.auteur}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Genre
          </label>
          <select
            name="genre_id"
            value={formData.genre_id}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Sélectionner un genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Note
          </label>
          <input
            name="note"
            type="text"
            value={formData.note}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Commentaire
          </label>
          <input
            name="commentaire"
            type="text"
            value={formData.commentaire}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Emprunté le
          </label>
          <input
            key={`date-achat-${formData.id}`}
            name="date_achat"
            type="date"
            value={formatDateForInput(formData.date_achat)}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Lu le
            </label>
            <input
              key={`date-lecture-${formData.id}`}
              name="date_lecture"
              type="date"
              value={formatDateForInput(formData.date_lecture)}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Ajouter d'autres champs similaires pour auteur, genre_nom, etc. */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sauvegarder
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Supprimer
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLivres;
