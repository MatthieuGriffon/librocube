import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoPath from "../assets/logo_trans_librocube.png";
import { useAuth } from "../utils/useAuth";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaUserCircle,
} from "react-icons/fa";

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-teal-500 flex flex-col md:flex-row lg:flex-row items-center justify-between p-4 lg:p-6 w-full">
      <div className="flex items-center flex-shrink-0 text-white">
        <Link to="/">
          <img
            src={logoPath}
            className="h-24 w-30 lg:h-32 lg:w-40"
            alt="Logo LibroCube"
          />
        </Link>
      </div>

      <div className="text-white font-bold md:flex-grow md:text-center md:text-3xl lg:text-1xl">
        <Link
          to="/"
          className="mt-4 md:mt-0 lg:mt-0 text-teal-200 hover:text-white mr-6 lg:mr-8"
        >
          Accueil
        </Link>
        <Link
          to="/books"
          className="mt-4 md:mt-0 lg:mt-0 text-teal-200 hover:text-white mr-6 lg:mr-8"
        >
          Livres
        </Link>
        <Link
          to="/add-book"
          className="mt-4 md:mt-0 lg:mt-0 text-teal-200 hover:text-white"
        >
          Ajouter un livre
        </Link>
      </div>

      <div className="flex flex-row self-end px-2 mt-4 md:mt-0 lg:mt-0 ml-auto">
        {isAuthenticated ? (
          <>
            <Link
              to="/info-utilisateur"
              title="Informations Utilisateur"
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-600 mr-4 lg:mr-6"
            >
              <FaUserCircle size="1.5em" />
            </Link>
            <button
              onClick={handleLogout}
              title="Déconnexion"
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-600"
            >
              <FaSignOutAlt size="1.5em" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              title="Connexion"
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-600 mr-4 lg:mr-6"
            >
              <FaSignInAlt size="1.5em" />
            </Link>
            <Link
              to="/login"
              title="Inscription"
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-600"
            >
              <FaUserPlus size="1.5em" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
