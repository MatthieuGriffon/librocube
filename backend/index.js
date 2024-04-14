import express from 'express';
import cors from 'cors';
import  userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import genreRoutes from './routes/genreRoutes.js';


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8173',
  optionsSuccessStatus: 200
}));

//Utilisation des Routes
app.use('/users', userRoutes)
app.use('/books', bookRoutes)
app.use('/genres', genreRoutes)


app.get('/', (req, res) => {
  res.send('Hello World, ES6 version!');
});

app.listen(port, async () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});