import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface Book {
  id: string;
  titre: string;
  auteur: string;
  genre_id: string;
  genre_nom: string;
  note: string;
  commentaire: string;
  date_lecture: string;
  date_achat: string;
}

export interface ModalProps {
  isOpen: boolean;
  book: Book;
  genres: Genre[]; // Genres are now passed as a prop
  onSave: (bookData: Book) => void;
  onDelete: (bookId: string) => void;
  closeModal: () => void;
  onUpdate: (updatedBook: Book) => void;
}

export interface Genre {
  id: string;
  nom: string;
}

const ModalLivres: React.FC<ModalProps> = ({
  isOpen,
  book,
  genres,
  onDelete,
  closeModal,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Book>(book);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && book) {
      const genreExists = genres.some((genre) => genre.id === book.genre_id);
      if (!genreExists) {
        console.error("Genre ID not found in available genres:", book.genre_id);
      }
      setFormData({
        ...book,
        genre_id: genreExists ? book.genre_id : "", // Use empty string if not found
        date_achat: formatDateForInput(book.date_achat),
        date_lecture: formatDateForInput(book.date_lecture),
      });
    }
  }, [isOpen, book, genres]);

  const formatDateForInput = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const timeZoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timeZoneOffset);
    return localDate.toISOString().split("T")[0];
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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
      navigate("/books");
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
          <label
            htmlFor="titre"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Titre
          </label>
          <input
            id="titre"
            name="titre"
            type="text"
            value={formData.titre}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="auteur"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Auteur
          </label>
          <input
            id="auteur"
            name="auteur"
            type="text"
            value={formData.auteur}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="genre_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Genre
          </label>
          <select
            id="genre_id"
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
          <label
            htmlFor="note"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Note
          </label>
          <input
            id="note"
            name="note"
            type="text"
            value={formData.note}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="commentaire"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Commentaire
          </label>
          <input
            id="commentaire"
            name="commentaire"
            type="text"
            value={formData.commentaire}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="date_achat"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Emprunté le
          </label>
          <input
            id="date_achat"
            key={`date-achat-${formData.id}`}
            name="date_achat"
            type="date"
            value={formatDateForInput(formData.date_achat)}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="mb-4">
            <label
              htmlFor="date_lecture"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Lu le
            </label>
            <input
              id="date_lecture"
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
