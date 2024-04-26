import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  interface Params {
    confirmationCode: string;
    [key: string]: string | undefined;
  }

  const { confirmationCode } = useParams<Params>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Gérer le succès

  useEffect(() => {
    fetch(`http://localhost:3000/users/confirm/${confirmationCode}`, {
      method: "GET",
    })
      .then(async (response) => {
        if (!response.ok) {
          // Assure-toi que la réponse est du JSON avant de la parser
          return response.text().then((text) => {
            try {
              const data = JSON.parse(text);
              throw new Error(
                data.message || "Échec de la confirmation de l'email"
              );
            } catch {
              throw new Error(text);
            }
          });
        }
        return response.json();
      })
      .then(() => {
        setError(null); // S'assurer de réinitialiser l'erreur
        setSuccess(
          "Email confirmé avec succès. Vous pouvez maintenant vous connecter."
        );
        setTimeout(() => navigate("/login"), 12000); // Redirection après 3 secondes
      })
      .catch((err): void => {
        setSuccess(null); // S'assurer de réinitialiser le succès si une erreur survient
        console.log("error du frontend", err);
        setError(err.message);
      });
  }, [confirmationCode, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-4">
        <h1 className="text-xl font-semibold text-center text-gray-900">
          Confirmation d'email
        </h1>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Erreur :</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Succès :</strong>
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        {!error && !success && (
          <p className="text-center text-gray-600">
            Veuillez patienter, confirmation en cours...
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
