import { 
    getBooksByUserId,
    addBook,
    updateBookInDB,
    checkBookOwnership,
    deleteBookFromDB,
    getBookDetailsById,
    getAllGenres
 } from "../models/book.js";

export const fetchUserBooks = async (req, res) => {
    try {
        console.log("UserID reçu dans la requête coter :", req.params.userId);
         const userId = req.params.userId;
         console.log("UserID extrait du token du bookController de la fetchUserBooks:", userId);
         const books = await getBooksByUserId(userId);
        console.log("Livres récupérés pour l'utilisateur:", books);
         res.json(books);
       
    } catch (error) {
        console.log("UserID extrait du token:", userId);
        console.error("Erreur lors de la récupération des livres:", error);
        
         res.status(500).json ({ error : "Erreur lors de la récupération des livres"}) 
    }
}

export const createBook = async (req, res) => {
    const { titre, auteur, dateAchat, dateLecture, commentaire, note } = req.body;
    const userId = req.userId;
    try {
        const newBook= await addBook (titre, auteur, dateAchat, dateLecture, commentaire, note, userId);
        res.status(201).json ({ message :"Livre ajouté avec succès", livre: newBook});
    } catch (error) {
        console.error("Erreur lors de l'ajout du Livre:", error);
        res.status(500).json({ message : "Erreur lors de l'ajot du livre"});
    }
}

export const updateBook = async (req, res) => {
    const { bookId } = req.params;
    const userId = req.userId; // Assure-toi que userId est bien extrait de l'authentification ou de la session
    const { titre, auteur, dateAchat, dateLecture, commentaire, note } = req.body;
  
    try {
      // Vérification de l'existence du livre pour cet utilisateur
      const ownershipConfirmed = await checkBookOwnership(bookId, userId);
      if (!ownershipConfirmed) {
        console.log("Livre non trouvé pour cet utilisateur.");
        return res.status(404).json({ message: "Livre non trouvé pour cet utilisateur." });
        
      }
  
      // Mise à jour du livre si l'utilisateur en est bien le propriétaire
      const updatedBook = await updateBookInDB(bookId, titre, auteur, dateAchat, dateLecture, commentaire, note, userId);
      if (updatedBook) {
        console.log("Livre mis à jour avec succès:", updatedBook);
        res.status(200).json({ message: "Livre mis à jour avec succès", livre: updatedBook });
      } else {
        console.log("Mise à jour non réalisée, vérifiez les données fournies.");
        res.status(404).json({ message: "Mise à jour non réalisée, vérifiez les données fournies." });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const deleteBook = async (req, res) => {
    const { bookId } = req.params;
    const userId = req.userId;

    try {
        const ownershipConfirmed = await checkBookOwnership(bookId, userId);
        if (!ownershipConfirmed) {
            console.log("Livre non trouvé pour cet utilisateur.");
            return res.status(404).json({ message: "Livre non trouvé pour cet utilisateur." });
        }

        const deletedCount = await deleteBookFromDB(bookId, userId);
        if(deletedCount > 0) {
            res.status(200).json({ message: "Livre supprimé avec succès"});
        } else {
            res.status(404).json({ message: "Erreur lors de la suppresion du livre."});
        }

    } catch (error) {
        console.error("Erreur lors de la suppression du livre:', error");
        res.status(500).json({ message : "Erreur lors de la suppression du livre"});
    }
};

export const getBookDetails = async (req, res) => {
    const bookId = req.params.bookId;  // Assurez-vous que c'est bien récupéré
    const userId = req.userId;

    console.log("Controller: Fetching details for bookId:", bookId, "with userId:", userId);
    try {
        const book = await getBookDetailsById(bookId, userId);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Livre non trouvé."});
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du livre:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des détails du livre."})
    }
};

export const listGenres = async (req, res) => {
    try {
        const genres = await getAllGenres();
        res.status(200).json(genres);
    }catch (error) {
        console.error("Erreur lors de la récupération des genres:", error);
        res.status(500).json({ message: "Erreur du serveur lors de la récupération des genres."});
    }
}