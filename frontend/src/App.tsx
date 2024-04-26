import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Accueil from "./components/Acceuil";
import Livres from "./components/Livres";
import AjouterUnLivre from "./components/AjouterUnLivre";
import Connexion from "./components/Connexion";
import InfoUtilisateur from "./components/InfoUtilisateur";
import ConfirmEmail from "./components/ConfirmEmail";
import { AuthProvider } from "./utils/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col h-screen">
          <header className="sticky top-0 z-50">
            <NavBar />
          </header>
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/books" element={<Livres />} />
              <Route path="/add-book" element={<AjouterUnLivre />} />
              <Route path="/login" element={<Connexion />} />
              <Route path="/info-utilisateur" element={<InfoUtilisateur />} />
              <Route
                path="/confirm/:confirmationCode"
                element={<ConfirmEmail />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
