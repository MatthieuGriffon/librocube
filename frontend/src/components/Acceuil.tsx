import React from "react";

const Accueil: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-4">
        Bienvenue sur LibroCube
      </h1>
      <div
        className="overflow-auto bg-white shadow-lg rounded-lg p-4 m-4"
        style={{ maxHeight: "calc(100vh - 5rem)" }}
      >
        <p className="text-md text-gray-700 mb-4">
          LibroCube est votre bibliothèque personnelle numérique où vous pouvez
          gérer et organiser votre collection de livres. Que vous souhaitiez
          suivre les livres que vous avez lus, ceux que vous possédez ou que
          vous avez emprunté, LibroCube vous aide à garder trace de tous vos
          livres dans un seul endroit pratique.
        </p>
        <div className="bg-blue-100 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Fonctionnalités clés</h2>
          <ul className="list-disc list-inside text-md text-gray-700">
            <li>
              Ajoutez des livres à votre bibliothèque personnelle avec facilité.
            </li>
            <li>
              Classez vos livres par genre, auteurs, ou statut de lecture (lu,
              non lu, en cours).
            </li>
            <li>
              Consignez vos impressions et commentaires personnels pour chaque
              livre.
            </li>
            <li>
              Visualisez rapidement votre collection et vos notes à tout moment.
            </li>
          </ul>
        </div>
        <div className="bg-green-100 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Technologies utilisées</h2>
          <ul className="list-disc list-inside text-md text-gray-700">
            <li>
              React et React Router pour une expérience utilisateur dynamique et
              interactive.
            </li>
            <li>Tailwind CSS pour un design élégant et réactif.</li>
            <li>
              Node.js et Express pour la logique côté serveur et la gestion des
              API.
            </li>
            <li>
              PostgreSQL pour le stockage et la récupération sécurisés des
              données.
            </li>
            <li>
              Docker pour assurer une mise en production et un déploiement
              fluides.
            </li>
          </ul>
        </div>
        {/* Ajoute plus de contenu ici si nécessaire pour démontrer le défilement */}
      </div>
    </div>
  );
};

export default Accueil;
