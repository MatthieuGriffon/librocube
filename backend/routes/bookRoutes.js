import express from 'express';
import { fetchUserBooks,
         createBook,
         updateBook,
         deleteBook,
         getBookDetails,
        } from '../controllers/bookController.js';

import  { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

/************************************/
//GESTION DES ROUTES POUR LES LIVRES//
/************************************/

router.get('/user/:userId/books', authenticateToken, fetchUserBooks);
router.post('/', authenticateToken, createBook);
router.put('/:bookId', authenticateToken, updateBook);
router.delete('/:bookId', authenticateToken, deleteBook);
router.get('/:bookId', authenticateToken, getBookDetails);
export default router;