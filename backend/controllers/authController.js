import { saveResetPasswordToken, resetPassword,findUserByEmail, findUserById, updateUserPassword } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        console.log("Login Attempt: User fetched:", user);

        if (!user) {
            console.log("Login Error: No user found with email:", email);
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log("Login Attempt: Password comparison result:", isMatch);

        if (!isMatch) {
            console.log("Login Error: Incorrect password for user:", email);
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("Login Successful: Token generated for user:", user.id);

        res.json({
            message: "Authentication successful",
            token,
            userId: user.id
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
    console.log("Received userId for password change:", userId);

    try {
        const user = await findUserById(userId);
        if (!user) {
            console.log("Change Password Error: No user found with ID:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        console.log("Old password comparison result:", isMatch);

        if (!isMatch) {
            console.log("Change Password Error: Incorrect old password for user:", userId);
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(userId, hashedNewPassword);
        console.log("Password changed successfully for user:", userId, "New Hash:", hashedNewPassword);

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Failed to change password", error: error.message });
    }
};

