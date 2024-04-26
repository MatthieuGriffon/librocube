import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

const Connexion: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/books");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); // Réinitialiser l'erreur précédente
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
    console.log("Attempting login with:", email, password); // Log 1

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
        const data = await response.json();
        console.log("Server response:", data); // Log 2
        if (!response.ok) {
          throw new Error(data.message || "Échec de l'authentification");
        }
        return data;
      })
      .then((data) => {
        if (data.email_verified) {
          login(data.token, data.userId, true);
          navigate("/books");
        } else {
          setError(
            "Veuillez vérifier votre adresse email avant de vous connecter."
          );
          console.log("Login failed: email not verified"); // Log 3
        }
      })
      .catch((error) => {
        console.error("Login Error:", error.message);
        setError(error.message);
        console.log("Login process error:", error.message); // Log 4
      });
  };

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("{error}");
    const form = event.currentTarget;
    const usernameInput =
      form.querySelector<HTMLInputElement>("#signup-username");
    const emailInput = form.querySelector<HTMLInputElement>("#signup-email");
    const passwordInput =
      form.querySelector<HTMLInputElement>("#signup-password");

    if (!usernameInput || !emailInput || !passwordInput) {
      setError(
        "Un ou plusieurs champs du formulaire d'inscription sont introuvables."
      );
      return;
    }

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    console.log("Attempting signup with:", username, email); // Log 1

    fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("Signup response data:", data); // Log 2
          setError(data.message);
          throw new Error(data.message);
        }
        setMessage(
          "Inscription réussie. Veuillez vérifier votre email pour activer votre compte."
        );
      })
      .catch((error) => {
        setError(error.toString());
        console.error("Signup Error:", error);
        console.log("Signup process error:", error.toString()); // Log 3
      });
  };

  return (
    <div className="space-y-8 p-2 max-w-md mx-auto bg-white rounded-lg shadow-md">
      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Succès !</strong>
          <span className="block sm:inline">{message}</span>
        </div>
      )}
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
