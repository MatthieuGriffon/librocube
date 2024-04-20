import { pool } from '../db.js'; 

export const getBooksByUserId = async (userId) => {
  try {
    const result = await pool.query(`
      SELECT livres.id, livres.titre, livres.auteur, livres.date_achat, livres.date_lecture, 
             livres.commentaire, livres.note, livres.user_id,livres.genre_id, genres.nom AS genre_nom
      FROM livres
      LEFT JOIN genres ON livres.genre_id = genres.id
      WHERE livres.user_id = $1
    `, [userId]);
    return result.rows;
  } catch (err) {
    console.error('Erreur lors de la récupération des livres pour l\'utilisateur:', err);
    throw err;
  }
}

export const addBook = async (titre, auteur, date_achat, date_lecture, commentaire, note, userId, genre_id) => {
  const result = await pool.query(
    'INSERT INTO livres (titre, auteur, date_achat, date_lecture, commentaire, note, user_id, genre_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [titre, auteur, date_lecture, date_achat, commentaire, note, userId, genre_id]
  );
  console.log(titre, auteur, genre_id, date_achat, date_lecture, commentaire, note, userId);
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

export const updateBookInDB = async (bookId, titre, auteur, date_achat, date_lecture, commentaire, note, userId, genre_id) => {
  console.log('Updating book in DB du models book.js', bookId, titre, auteur, date_achat, date_lecture, commentaire, note, userId, genre_id)
  await pool.query(
    `UPDATE livres SET
      titre = $1, auteur = $2, date_achat = $3, date_lecture = $4, commentaire = $5, note = $6, genre_id = $9
    WHERE id = $7 AND user_id = $8`,
    [titre, auteur, date_achat, date_lecture, commentaire, note, bookId, userId, genre_id]
  );
  console.log('Received dates du upadateBookInDb:', date_achat, date_lecture);
  // Récupérer le livre mis à jour avec le genre
  const result = await pool.query(
    `SELECT livres.*, genres.nom as genre_nom
    FROM livres
    JOIN genres ON genres.id = livres.genre_id
    WHERE livres.id = $1`,
    [bookId]
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