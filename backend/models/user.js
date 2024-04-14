import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash
    (password, 10);
    const { rows } = await pool.query (
        'INSERT INTO utilisateurs(username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
    );
    return rows[0];
};

export const deleteUser= async (id) => {
    await pool.query (
        'DELETE FROM utilisateurs WHERE id = $1', [id]);
};

export const findUserById = async (userId) => {
    try {
        const { rows } = await pool.query (
            'SELECT id, username, email, password_hash, date_creation FROM utilisateurs WHERE id = $1',
            [userId]
        );
        return rows[0];
    } catch (error) {
         ("Erreur lors de la recherche de l'utilisateur par ID", error);
    throw error;
    }
};


export const findUserByEmail = async (email) => {
    const { rows } = await pool.query (
        'SELECT * FROM utilisateurs WHERE email = $1',
        [email]
    );
    return rows[0];
};

export const updateUser = async (userId, username, email) => {
    const { rows } = await pool.query (
        'UPDATE utilisateurs SET username = $1, email = $2 WHERE id = $3 RETURNING *',
        [username, email, userId]
    );
    return rows[0];
}

export const saveResetPasswordToken  = async (email) => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 1);

    const { rows } = await pool.query (
        'UPDATE utilisateurs SET reset_token = $1, reset_token_expire = $2 WHERE email = $3 RETURNING *',
        [resetToken, expireAt, email]
    );
    return rows[0] ? {resetToken, expireAt} : null;
};

export const resetPassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hashage du nouveau mot de passe
    try {
        const { rows } = await pool.query(
            'UPDATE utilisateurs SET password_hash = $1 WHERE id = $2 RETURNING *',
            [hashedPassword, userId]
        );
        return rows[0]; // Retourne l'utilisateur mis à jour
    } catch (error) {
        throw new Error('Erreur lors de la mise à jour du mot de passe');
    }
};

export const updateUserPassword = async (userId, newPasswordHash) => {
    try {
        const { rows } = await pool.query(
            'UPDATE utilisateurs SET password_hash = $1 WHERE id = $2 RETURNING *',
            [newPasswordHash, userId]
        );
        return rows[0];
    } catch (error) {
        console.error("Error updating user password:", error);
        throw error;
    }
};