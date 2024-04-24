import { createUser, deleteUser, updateUser, findUserById,verifyUserEmail  } from "../models/user.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET;


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await createUser (username, email, password);
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

        // Envoyer l'email de confirmation
        const emailContent = `
            <h1>Confirmation de votre compte</h1>
            <p>Merci de vous être inscrit. Veuillez confirmer votre email en cliquant sur le lien ci-dessous:</p>
            <a href="http://localhost:3000/users/confirm/${newUser.confirmation_code}">Confirmer l'email</a>
        `;
        sendEmail(email, "Confirmation de votre compte", emailContent);


        res.status(201).json({
            userId: newUser.id,
            message: "Utilisateur créé avec succès, veuillez confirmer votre email.",
            user: newUser,
            token,
        });

    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ 
            message: "Erreur lors de la création de l'utilisateur",
            error: error.toString()
        });
    }
}

export const confirmEmail = async (req, res) => {
    const { confirmationCode } = req.params;
    try {
        const user = await verifyUserEmail(confirmationCode);
        if (user) {
            res.json({ message: "Email vérifié avec succès.", user });
        } else {
            res.status(404).json({ message: "Code de confirmation invalide ou déjà utilisé." });
        }
    } catch (error) {
        console.error("Error during email confirmation:", error);
        res.status(500).json({ message: "Erreur lors de la confirmation de l'email", error: error.toString() });
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const user = await findUserById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            date_creation: user.date_creation
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des informations de l'utilisateur",
            error: error.message
        });
    }
};


export const removeUser = async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.status(200).json({ 
            message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.statuts(500).json ({
            message : "Erreur lors de la suppression de l'utilisateur",
            error: error.message,
        })
    }
};

export const updateUserInfo = async (req, res) => {
    const { userId } =  req.params;
    const { username, email } = req.body;
    try {
        const updatedUser = await updateUser (userId, username, email);
        res.json ({
            message: "Informations de l'utilisateur mises à jour avec succès",
            user: updatedUser,
        });
    }
    catch (error) {
        res.statuts(500).json ({
            message : "Erreur lors de la mise à jour des informations de l'utilisateur",
            error:error.message,
        });
    }
    };