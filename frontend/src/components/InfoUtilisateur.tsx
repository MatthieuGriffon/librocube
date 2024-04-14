import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const InfoUtilisateur: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    dateCreation: "",
  });
  const [showChangePasswordFields, setShowChangePasswordFields] =
    useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUserInfo = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Aucun token trouvé");
        return;
      }

      fetch("http://localhost:3000/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && !data.error) {
            setUserInfo({
              username: data.username,
              email: data.email,
              dateCreation: data.date_creation,
            });
          } else {
            throw new Error(
              data.error || "Erreur lors de la récupération des données"
            );
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des informations de l'utilisateur:",
            error
          );
        });
    };

    fetchUserInfo();
  }, []);

  const toggleChangePasswordFields = () => {
    setShowChangePasswordFields(!showChangePasswordFields);
  };

  const handleChangePassword = async () => {
    fetch("http://localhost:3000/users/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"), // Assurez-vous de stocker l'userId lors de la connexion
        oldPassword,
        newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Password change response:", data);
        if (data.message) {
          setShowChangePasswordFields(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Erreur lors du changement de mot de passe");
      });
  };

  const handleDeleteAccount = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Problème lors de la suppression du compte");
        }
        return response.json(); // Transforme la réponse en JSON
      })
      .then((data) => {
        console.log(data.message); // Affiche le message retourné par le serveur
        logout(); // Déconnecte l'utilisateur
        navigate("/"); // Redirige vers la page d'accueil
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du compte:", error);
        alert("Erreur lors de la suppression du compte: " + error.message);
      })
      .finally(() => {
        setModalOpen(false); // Ferme le modal dans tous les cas après la requête
      });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Informations de l'utilisateur
      </h2>
      <p>
        Nom d'utilisateur:{" "}
        <span className="text-gray-800 font-light">{userInfo.username}</span>
      </p>
      <p>
        Email:{" "}
        <span className="text-gray-800 font-light">{userInfo.email}</span>
      </p>
      <p>
        Date de création du compte:{" "}
        <span className="text-gray-800 font-light">
          {new Date(userInfo.dateCreation).toLocaleDateString()}
        </span>
      </p>
      <button
        onClick={toggleChangePasswordFields}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Changer de mot de passe
      </button>
      {showChangePasswordFields && (
        <div>
          <div className="mb-4">
            {" "}
            <label
              htmlFor="oldPassword-userInfo"
              className="block font-medium text-gray-700"
            >
              Ancien mot de passe
            </label>
            <input
              type="password"
              id="oldPassword-userInfo"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Saisissez votre ancien mot de passe"
              className="input input-bordered input-primary w-full max-w-xs"
            />
          </div>

          <div className="mb-4">
            {" "}
            <label
              htmlFor="newPassword-userInfo"
              className="block font-medium text-gray-700"
            >
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword-userInfo"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Saisissez votre nouveau mot de passe"
              className="input input-bordered input-primary w-full max-w-xs"
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Confirmer le changement
          </button>
        </div>
      )}

      <button
        onClick={() => setModalOpen(true)}
        className="bg-red-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Supprimer le compte
      </button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteAccount}
      >
        <p>
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
          irréversible !
        </p>
      </Modal>
    </div>
  );
};

export default InfoUtilisateur;
