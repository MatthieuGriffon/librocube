import { saveResetPasswordToken, resetPassword,findUserByEmail, findUserById, updateUserPassword } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Cet utilisateur n'existe pas!Veuillez vous enregistré." });
        }
        console.log("user_email_verfied du composant authController",user.email_verified);
        if (!user.email_verified) {
            return res.status(403).json({ message: "Veuillez vérifier votre adresse email avant de vous connecter." });
        }
        console.log(user);
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorect!" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            message: "Authentication successful",
            token,
            userId: user.id,
            email_verified: user.email_verified
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
        }

        const { resetToken } = await saveResetPasswordToken(email);
        // Dans un cas réel, vous enverriez un email à l'utilisateur avec le lien contenant le resetToken
        return res.json({ resetToken, message: "Email de réinitialisation du mot de passe envoyé." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la demande de réinitialisation du mot de passe." });
    }
};

export const performPasswordReset = async (req, res) => {
    const { userId, newPassword, resetToken } = req.body;
    try {
       const updatedUser = await resetPassword(userId, newPassword);
        if (!updatedUser) {
            return res.status(400).json({ message: "Impossible de réinitialiser le mot de passe." });
        }
        return res.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe." });
    }
};

export const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(userId, hashedNewPassword);

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Failed to change password", error: error.message });
    }
};

