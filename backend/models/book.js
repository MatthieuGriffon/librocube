import { pool } from '../db.js'; 

export const getBooksByUserId = async (userId) => {
  try {
    console.log("Queried database for user:", userId);
    const result = await pool.query('SELECT * FROM livres WHERE user_id = $1', [userId]);
    return result.rows; 
  } catch (err) {
    console.error('Erreur lors de la récupération des livres pour l\'utilisateur:', err);
    throw err;
  }
}

export const addBook = async (titre, auteur, dateAchat, dateLecture, commentaire, note, userId) => {
  const result = await pool.query (
    'INSERT INTO livres (titre, auteur, date_achat, date_lecture, commentaire, note, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [titre, auteur, dateAchat, dateLecture, commentaire, note, userId]
  );
  return result.rows[0];
};

export const checkBookOwnership = async (bookId, userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM livres WHERE id = $1 AND user_id = $2',
      [bookId, userId]
    );
    return result.rows.length > 0; // Retourne true si le livre existe, sinon false
  } catch (err) {
    console.error("Erreur lors de la vérification du livre:", err);
    throw err;
  }
}

export const updateBookInDB = async (bookId, titre, auteur, dateAchat, dateLecture, commentaire, note, userId) => {
  const result = await pool.query(
    'UPDATE livres SET titre = $1, auteur = $2, date_achat = $3, date_lecture = $4, commentaire = $5, note = $6 WHERE id = $7 AND user_id = $8 RETURNING *',
    [titre, auteur, dateAchat, dateLecture, commentaire, note, bookId, userId]
  );
  return result.rows[0];
}

export const deleteBookFromDB = async (bookId, userId) => {
  const result = await pool.query(
    'DELETE FROM livres WHERE id = $1 AND user_id = $2',
    [bookId, userId]);
    return result.rowCount;
}

export const getBookDetailsById = async (bookId, userId) => {
  try {
    console.log(`Fetching book details for bookId: ${bookId} and userId: ${userId}`);
    const result = await pool.query(
      'SELECT * FROM livres WHERE id = $1 AND user_id = $2',
      [bookId, userId]
    );
    console.log(`Query result: `, result.rows);
    return result.rows[0];
  } catch (err) {
    console.error('Erreur lors de la récupération des détails du livre:', err);
    throw err;
  }
}

export const getAllGenres = async () => {
  try {
    const result = await pool.query('SELECT * FROM genres');
    return result.rows;
  }catch (error){
    console.error('Erreur lors de la récupération des genres:', error);
    throw error;
  }
}