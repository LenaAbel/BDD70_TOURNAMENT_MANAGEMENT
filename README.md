# BDD70_TOURNAMENT_MANAGEMENT : Board Game Tournament Management System 🎲

## Objective
This project aims to develop a relational database system for managing board game tournaments. This system enables organizers to register players, schedule matches, track scores, and generate rankings for various popular board games.

## Key Features
- **User Authentication**: Allows players and organizers to sign up and log in.
- **Player Registration**: Creates player profiles with details like name, contact information, and preferred board games; tracks tournament history and rankings.
- **Game Management**: Maintain a game catalog with rules, player numbers, and types (solo or team-based).
- **Tournament Setup**: Allows organizers to create tournaments, select game types, set player/team counts, and define match rules (e.g., single-elimination, Swiss system).
- **Match Scheduling**: Automatically pairs matches based on participants, including details like date, time, and location.
- **Score and Results Tracking**: Records match results, and updates player/team rankings based on scores.
- **Team Management**: Allows players to form teams, tracks individual and team performance, and enables substitutions in team matches if necessary.
- **Rankings and Rewards**: Calculates rankings based on match performance and awards trophies or badges for top players or teams.

## Scope
The system supports both solo and team tournaments and includes a user interface for managing registrations, tournament setup, scores, and rankings.

## Technical Constraints
- Uses MySQL/MariaDB for database management.
- Adheres to data security and confidentiality standards.
- Provides a user-friendly interface for data management.
- Optimizes database and query performance.

## Deliverables
- UML Use Case Diagram, conceptual and logical database models.
- Populated database with sample data.
- Minimal management interface.
- Detailed documentation and performance analysis report for main queries.

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** (version 12 or higher)
- **npm** (comes with Node.js)
- **Vue CLI**
- **MySQL**

### Install Node.js and npm

Download and install Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)

Verify the installation by running:

```bash
node -v
npm -v
```

### Install Vue CLI

Install the Vue Command Line Interface globally:

```bash
npm install -g @vue/cli
```

Verify the installation:

```bash
vue --version
```

### Install MySQL

Download and install MySQL Community Server from the official website: [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

Ensure that the MySQL server is running and you have access to it.

## Project Setup

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/LenaAbel/BDD70_TOURNAMENT_MANAGEMENT.git
```

Replace `yourusername` and `your-repo-name` with your GitHub username and repository name.

### 2. Navigate to the Project Directory

```bash
cd your-repo-name
```

### 3. Install Backend Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies

Navigate to the frontend directory and install the required packages:

```bash
cd ../frontend
npm install
```

## Database Setup

### 1. Create the Database

Log into your MySQL server using the command line or a tool like MySQL Workbench.

Create a new database named `bd70_tournament`:

```sql
CREATE DATABASE bd70_tournament;
```

### 2. Configure Database User (Optional)

Ensure that the MySQL user specified in your `.env` file has the necessary permissions for the `bd70_tournament` database.

## Environment Variables

### 1. Create a `.env` File for the Backend

In the `backend` directory, create a file named `.env` and add the following content:

```env
DB_HOST=127.0.0.1
DB_USER=your_user
DB_PASS=your_password
DB_NAME=bd70_tournament
JWT_SECRET=a_secret_key
```

- **DB_HOST**: Database host (usually `127.0.0.1` or `localhost`)
- **DB_USER**: Database username (default is `root`)
- **DB_PASS**: Database password (leave blank if not set)
- **DB_NAME**: Name of the database (`bd70_tournament`)
- **JWT_SECRET**: Secret key for JWT authentication (choose a strong, random string)

## Running the Application

### 1. Start the Backend Server

Navigate to the backend directory (if you're not already there) and start the server:

```bash
cd backend
npm start
```

This will start the backend server on `http://localhost:3000`.

### 2. Start the Frontend Development Server

Open a new terminal window, navigate to the frontend directory, and start the development server:

```bash
cd frontend
npm run serve
```

This will start the frontend server on `http://localhost:8080`.

### 3. Access the Application

Open your web browser and navigate to `http://localhost:8080` to view the application.

## Additional Information

### API Endpoints

- The backend API is accessible at `http://localhost:3000/api`.

## Troubleshooting

### Common Issues

- **Database Connection Errors**: Ensure that your MySQL server is running and the credentials in your `.env` file are correct.
- **Port Conflicts**: If ports 3000 or 8080 are already in use, you may need to change the ports in your backend or frontend configurations.
- **Dependency Errors**: If you encounter issues during `npm install`, try deleting the `node_modules` directory and running `npm install` again.

### Logs

- **Backend Logs**: Check the console output where the backend server is running for any error messages.
- **Frontend Logs**: Use your browser's developer console to view any frontend errors.

