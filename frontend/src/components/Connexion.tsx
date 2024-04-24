import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

const Connexion: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/books");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const emailInput = form.querySelector<HTMLInputElement>("#login-email");
    const passwordInput =
      form.querySelector<HTMLInputElement>("#login-password");

    if (!emailInput || !passwordInput) {
      setError("Les champs du formulaire sont introuvables.");
      return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(async (response) => {
        const data = await response.json(); // Parse JSON response in any case
        if (!response.ok) {
          // Check if the specific error is related to user not found or verification needed
          const errorMessage = data.message || "Échec de l'authentification";
          if (errorMessage === "User not found") {
            setError("Cet utilisateur n'existe pas. Veuillez vous inscrire.");
          } else if (errorMessage.includes("verify your email")) {
            setError("Veuillez vérifier votre adresse email.");
          } else if (errorMessage.includes("Incorrect password")) {
            setError("Mot de passe incorrect.");
          } else {
            setError(errorMessage);
          }
          throw new Error(errorMessage);
        }
        return data;
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        login(data.token, data.userId);
        navigate("/books");
      })
      .catch((error) => {
        console.error("Login Error:", error.message);
      });
  };

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const usernameInput =
      form.querySelector<HTMLInputElement>("#signup-username");
    const emailInput = form.querySelector<HTMLInputElement>("#signup-email");
    const passwordInput =
      form.querySelector<HTMLInputElement>("#signup-password");

    if (!usernameInput || !emailInput || !passwordInput) {
      console.error(
        "Un ou plusieurs champs du formulaire d'inscription sont introuvables."
      );
      return;
    }

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User registered successfully", data.userId, data.token);
        if (!data.userId) {
          throw new Error("UserId missing in the response");
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        login(data.token, data.userId);
        navigate("/books");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="space-y-8 p-2 max-w-md mx-auto bg-white rounded-lg shadow-md">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Erreur !</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <h2 className="text-sm font-bold text-center">Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-2">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse email
            </label>
            <input
              type="email"
              id="login-email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="login-password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-1 px-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Se connecter
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-sm font-bold text-center">Inscription</h2>
        <form onSubmit={handleSignup} className="space-y-2">
          <div>
            <label
              htmlFor="signup-username"
              className="block text-sm font-medium text-gray-700"
            >
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="signup-username"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse email
            </label>
            <input
              type="email"
              id="signup-email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="signup-password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-1 px-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connexion;
