import express from 'express';
import { registerUser, removeUser, updateUserInfo,getUserInfo  } from '../controllers/userController.js';
import { loginUser, requestPasswordReset, performPasswordReset, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';


const router = express.Router();

/*********************************/
//GESTION DES ROUTES UTILISATEURS//
/*********************************/

// Route pour l'inscription d'un nouvel utilisateur
router.post('/register',registerUser);

// Route pour la connexion d'un utilisateur
router.post('/login', loginUser);

// Route pour la récupération des informations d'un utilisateur
router.get('/me',authenticateToken, getUserInfo);

// Route pour la suppression d'un utilisateur
router.delete('/:id',authenticateToken, removeUser);

//Route pour la mise a jour d'un utilisateur
router.put('/:userId',authenticateToken, updateUserInfo);

// Endpoint pour changer le mot de passe
router.post('/change-password', authenticateToken, changePassword);

//Route pour la demande de réinitialisation du mot de passe
router.post('/reset-password/request', requestPasswordReset);

//Route pour la réinitialisation du mot de passe
router.post('/reset-password/reset', performPasswordReset);

// Route pour la déconnexion d'un utilsateur
router.post('/logout', (req,res) =>{
    res.status(200).json({
        message : "Déconnexion réussie. Supprimer le token du coté client."
    })
})
export default router;