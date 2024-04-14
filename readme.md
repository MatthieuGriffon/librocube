# LibroCube - Book Management API

## Introduction

LibroCube is a RESTful API designed primarily as a demonstration project to illustrate the practical application of various technologies in full-stack web development. It allows users to manage a book collection, offering CRUD functionalities for books, and includes robust authentication to secure user data access.

This project serves not only as a technical showcase but also demonstrates how backend and frontend elements can be seamlessly integrated to create a complete and functional application.

## Project Objective

- **Technical Demonstration**: Use this project to showcase how various technologies can be integrated to build a full-stack application.
- **Learning Tool**: Serve as a means for developers to practice and gain experience with specific technologies.
- **Foundation for Future Projects**: Act as a foundation or inspiration for more complex or commercially viable projects.

## Technologies Used

### Backend Development
- **Node.js**: Server-side JavaScript runtime environment.
- **Express.js**: Framework used to build the RESTful API.
- **PostgreSQL**: Relational database to store data.
- **JWT (JSON Web Tokens)**: Used for authentication and session management.
- **bcrypt**: Used for password hashing.
- **Docker**: Used to containerize the application and database.

### Frontend Development
- **React.js**: Used to build the user interface.
- **Tailwind CSS**: Used for styling and responsive design.
- **Vite**: Modern build tool to speed up development.
- **Fetch API**: Used to make HTTP requests from the client to the API.

### Development and Testing Tools
- **Visual Studio Code**: Recommended IDE for development.
- **Postman**: Used to test API endpoints.
- **Git**: Used for version control.
- **GitHub**: Used for source code storage and collaboration.

### Deployment and Infrastructure
- **IONOS Server**: Server used to host the application.
- **Nginx**: Web server used to serve the frontend and act as a reverse proxy for the API.
- **pm2**: Used to keep the backend application running.
- **Docker Compose**: Used to orchestrate Docker containers.
- **Let's Encrypt (via Certbot)**: Used to secure communications with an SSL certificate.

## Installation

Clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/MatthieuGriffon/librocube.git
cd librocube
# Install dependencies for the backend
cd backend
npm install
# Install dependencies for the frontend
cd ../frontend
npm install
```

### Configuration and Setup

- **'.env' File**  The project uses an .env file to manage sensitive configurations and secrets, such as database credentials, JWT secrets, and other necessary environment variables.
Note: For security reasons, the .env file is not included in the project files on GitHub. You will need to create your own .env file based on the template provided below to connect to your own database and configure other necessary aspects of the environment.

-- **Template for '.env' File**  Here is a basic template for the .env file that you will need to create and fill in with your own values:

```bash
# Database configuration
DB_HOST=localhost
DB_USER=myUser
DB_PASS=myPassword
DB_NAME=myDatabase

# Secret for JSON Web Tokens
JWT_SECRET=mySuperSecret

# Other potential configurations
PORT=3000
```
### Database Schema

LibroCube uses PostgreSQL as a relational database management system. UUIDs are used as primary identifiers for all tables to ensure data uniqueness and security.

- *SQL Scripts for Creating Tables*
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



### UUsage

- **Start the backend server** cd bakcend/npm run dev
- **Start the frontend application** cd frontend/npm run dev
  
### Contribution

- **Contributions to this project are welcome. Please see the GitHub issues for pending tasks, or create a pull request with your improvements.**

### License

This project is distributed under the MIT License.

##

