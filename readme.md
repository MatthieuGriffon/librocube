# LibroCube-Gestionnaire de Livres API

## Introduction

LibroCube est une API RESTful conçue principalement comme un projet démonstratif pour illustrer l'application pratique de diverses technologies dans le développement web full-stack. Elle permet aux utilisateurs de gérer une collection de livres, offrant des fonctionnalités pour créer, lire, mettre à jour et supprimer (CRUD) des informations sur les livres. Le système gère également les favoris personnels et inclut une authentification robuste pour sécuriser l'accès aux données utilisateur.

Ce projet n'est pas seulement une démonstration de compétences en développement backend et frontend, mais sert également à montrer comment ces éléments peuvent être intégrés de manière fluide pour créer une application complète et fonctionnelle.

## Objectif du projet

- *Démonstration technique* : Utiliser ce projet pour illustrer comment diverses technologies peuvent être intégrées pour construire une application full-stack.
- *Apprentissage* : Utiliser ce projet comme moyen pour les développeurs de pratiquer et d'acquérir de l'expérience avec les technologies spécifiques utilisées.
Base pour des projets futurs : Servir de fondation ou d'inspiration pour des projets plus complexes ou commercialement viables.

## Technologies Utilisées

### Développement Backend
- **Node.js** : Environnement d'exécution pour JavaScript côté serveur.
- **Express.js** : Framework utilisé pour construire l'API.
- **PostgreSQL** : Base de données relationnelle pour stocker les données.
- **JWT (JSON Web Tokens)** : Utilisé pour l'authentification et la gestion des sessions.
- **bcrypt** : Utilisé pour le hachage des mots de passe.
- **Docker** : Utilisé pour conteneuriser l'application et la base de données.

### Développement Frontend
- **React.js** : Utilisé pour construire l'interface utilisateur.
- **Tailwind CSS** : Utilisé pour le styling et le design responsive.
- **Vite** : Outil de build moderne pour accélérer le développement.
- **Fetch API** : Utilisée pour faire des requêtes HTTP depuis le client vers l'API.

### Outils de Développement et Test
- **Visual Studio Code** : IDE recommandé pour le développement.
- **Postman** : Utilisé pour tester les endpoints de l'API.
- **Git** : Utilisé pour le contrôle de version.
- **GitHub** : Utilisé pour le stockage du code source et la collaboration.

### Déploiement et Infrastructure
- **IONOS Server** : Serveur utilisé pour l'hébergement de l'application.
- **Nginx** : Serveur web utilisé pour servir le frontend et agir comme reverse proxy pour l'API.
- **pm2** : Utilisé pour maintenir l'application backend en exécution.
- **Docker Compose** : Utilisé pour orchestrer les conteneurs Docker.
- **Let's Encrypt (via Certbot)** : Utilisé pour sécuriser les communications avec un certificat SSL.

### Installation

Clonez ce dépôt et installez les dépendances nécessaires.

```bash
git clone https://github.com/tonusername/librocube.git
cd librocube
# Installer les dépendances pour le backend
cd backend
npm install
# Installer les dépendances pour le frontend
cd ../frontend
npm install
```

### Configuration et Mise en Place

- **Fichier '.env'**  Le projet utilise un fichier .env pour gérer les configurations sensibles et les secrets, tels que les identifiants de la base de données, les secrets JWT, et d'autres variables d'environnement nécessaires pour le fonctionnement de l'application.

Note : Pour des raisons de sécurité, le fichier .env n'est pas inclus dans les fichiers du projet sur GitHub. Vous devez créer votre propre fichier .env en vous basant sur le modèle fourni ci-dessous pour vous connecter à votre propre base de données et configurer les autres aspects nécessaires de l'environnement.

-- **Modele de fichier '.env'** Voici un modèle de base pour le fichier .env que vous devrez créer et remplir avec vos propres valeurs :
```bash
# Configuration de la base de données
DB_HOST=localhost
DB_USER=monUtilisateur
DB_PASS=monMotDePasse
DB_NAME=maBaseDeDonnees

# Secret pour JSON Web Token
JWT_SECRET=monSuperSecret

# Autres configurations potentielles
PORT=3000
```
### Schéma de la Base de Données

LibroCube utilise PostgreSQL comme système de gestion de base de données relationnelle. Les UUIDs sont utilisés comme identifiants primaires pour toutes les tables afin d'assurer l'unicité et la sécurité des données.

- *Scripts SQL pour la création des tables*
  ```bash
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expire TIMESTAMP
    );

    CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE livres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    date_achat DATE NOT NULL,
    date_lecture DATE,
    commentaire TEXT,
    note INT,
    user_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE
    );

    CREATE TABLE livresgenres (
    livre_id UUID REFERENCES livres(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (livre_id, genre_id)
    );
  ```



### Utilisation

- **Lancer le serveur backend** cd bakcend/npm run dev
- **Lancer l'application frontend** cd frontend/npm run dev
  
### Contribution

- **Les contributions à ce projet sont les bienvenues. Veuillez consulter les issues GitHub pour les tâches en attente, ou créez un pull request avec vos améliorations.**

### License

Ce projet est distribué sous la licence MIT.

##

