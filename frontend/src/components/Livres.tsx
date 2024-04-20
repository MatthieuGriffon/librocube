import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import ModalLivres from "./ModalLivres";

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

export interface Genre {
  id: string;
  nom: string;
}

const formatDateForInput = (dateString: string | number | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timeZoneOffset);
  return localDate.toISOString().split("T")[0];
};

const Livres: React.FC = () => {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [livres, setLivres] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const openModal = (book: Book) => {
    if (!book.genre_id) {
      alert("Ce livre n'a pas de genre valide.");
      return;
    }
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };
  useEffect(() => {
    const fetchGenres = async () => {
      if (token) {
        const response = await fetch("http://localhost:3000/genres", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const genresData = await response.json();
          setGenres(genresData);
        } else {
          throw new Error("Failed to fetch genres");
        }
      }
    };

    fetchGenres();
  }, [token]);

  const onSave = (bookData: Book) => {
    fetch(`http://localhost:3000/api/${bookData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assurez-vous que le token est correctement géré
      },
      body: JSON.stringify(bookData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.livre) {
          const updatedBooks = livres.map((book) => {
            if (book.id === data.livre.id) {
              return { ...book, ...data.livre };
            }
            return book;
          });
          setLivres(updatedBooks);
          closeModal();
        } else {
          throw new Error(data.message || "Mise à jour échouée");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du livre:", error);
      });
  };

  const handleBookUpdate = (updatedBook: { id: string }) => {
    const updatedBooks = livres.map((book) => {
      if (book.id === updatedBook.id) {
        return { ...book, ...updatedBook };
      }
      return book;
    });
    setLivres(updatedBooks);
  };

  const onDelete = (bookId: string) => {
    // Logique pour supprimer le livre du serveur
    console.log("Deleting book", bookId);
  };

  const fetchLivres = useCallback(() => {
    if (token && userId) {
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
          const booksWithGenre = data.map((book: { genre_id: unknown }) => ({
            ...book,

            genre_id: book.genre_id || "fallback-genre-id",
          }));
          setLivres(booksWithGenre);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des livres:", error);
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
              <th className="px-1 py-1 text-xs md:text-base">Action</th>
              <th className="px-1 py-1 text-xs md:text-base">Titre</th>
              <th className="px-1 py-1 text-xs md:text-base">Auteur</th>
              <th className="px-1 py-1 text-xs md:text-base">Genre</th>
              <th className="px-1 py-1 text-xs md:text-base">Note</th>
              <th className="px-1 py-1 text-xs md:text-base">Commentaires</th>
              <th className="px-1 py-1 text-xs md:text-base">Achat/Emprunt</th>
              <th className="px-1 py-1 text-xs md:text-base">Lu le</th>
            </tr>
          </thead>
          <tbody>
            {livres.map((livre, index) => (
              <tr key={index} className="border-b text-center md:text-base">
                <td className="px-1 py-1 text-xs md:text-base">
                  <button onClick={() => openModal(livre)}>Éditer</button>
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.titre}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.auteur}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.genre_nom}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">{livre.note}</td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {livre.commentaire}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {formatDateForInput(livre.date_achat)}
                </td>
                <td className="px-1 py-1 text-xs md:text-base">
                  {formatDateForInput(livre.date_lecture)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && selectedBook && (
          <ModalLivres
            isOpen={isModalOpen}
            book={selectedBook}
            genres={genres}
            closeModal={closeModal}
            onSave={onSave}
            onUpdate={handleBookUpdate} // Assurez-vous de passer cette fonction
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Livres;
