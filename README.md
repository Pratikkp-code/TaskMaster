# TaskMaster: A Full-Stack, Real-Time Task Management Application 🚀

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Google Cloud"/>
</p>

TaskMaster is a comprehensive, full-stack application designed to showcase a deep understanding of modern software architecture and development best practices. Built on a scalable, real-time microservices architecture, this project goes beyond a simple to-do list to deliver a feature-rich, production-grade user experience, fully containerized with Docker and deployed to the cloud.

[Live Demo: Link to your deployed Vercel or Render URL]

## 📋 Table of Contents
- [🚀 Project Showcase](#-project-showcase)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture & System Design](#️-architecture--system-design)
- [🛠️ Tech Stack](#️-tech-stack)
- [▶️ Running the Project Locally](#️-running-the-project-locally)
- [☁️ Deployment](#️-deployment)

***

## 🚀 Project Showcase

A visual overview of the application's core features.

| Interactive Kanban Board | Feature-Rich Task Details | Real-Time Calendar View |
| :---: | :---: | :---: |
| ![Kanban Board](URL_TO_YOUR_KANBAN_GIF) | ![Task Details Modal](URL_TO_YOUR_MODAL_GIF) | ![Calendar View](URL_TO_YOUR_CALENDAR_GIF) |

(Recommendation: Use a tool like Giphy Capture or ScreenToGif to create short screen recordings of these features and replace the placeholder links.)

***

## ✨ Key Features

This project was intentionally "over-engineered" to demonstrate a wide range of advanced skills.

- **Real-Time Collaboration**: Changes are instantly broadcast to all connected clients using WebSockets without needing a page refresh.
- **Interactive Kanban Board**: A Trello-like board with smooth, animated drag-and-drop functionality powered by `@dnd-kit` and Framer Motion.
- **Feature-Rich Task Details**: Click on any task to open a detailed modal with:
    - **File Attachments**: Upload files directly to tasks, with storage handled by Google Cloud Storage (GCS).
    - **Comments & Activity**: A real-time comment feed for task collaboration.
    - **Location Tagging**: Add a physical address to any task, which is converted to coordinates using the Google Geocoding API and displayed on an interactive Google Map.
    - **Task Priorities**: Assign Low, Medium, or High priority to tasks, visualized with colored tags.
- **Calendar View**: A full-screen calendar, powered by React Big Calendar, that displays all tasks with due dates and allows for event creation.
- **Full-Text Search**: An efficient, debounced search bar to instantly filter tasks on the board.
- **Secure Authentication**: User registration and login system using JWT (JSON Web Tokens), with password hashing via bcrypt.

***

## 🏗️ Architecture & System Design

The core of this project is its **Microservices Architecture**, designed for scalability and separation of concerns.

- **Frontend**: A standalone Next.js client responsible for all UI and user interaction.
- **Backend Services**: Four independent, containerized Node.js/Express services:
    - **Auth Service**: Manages user registration, login, and JWT generation.
    - **Task Service**: Handles all business logic for tasks, comments, and attachments.
    - **Geo Service**: A dedicated service that communicates with the Google Geocoding API.
    - **Real-time Service**: Manages all WebSocket connections and broadcasts live updates.
- **Event-Driven Communication**: Services communicate in a decoupled manner using a Redis Pub/Sub message broker. This ensures high performance and resilience.

![Architecture Diagram](URL_TO_YOUR_ARCHITECTURE_DIAGRAM)
(Optional but highly recommended: Create a simple diagram using a tool like diagrams.net and add it here.)

***

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js, React, JavaScript (JSX), Tailwind CSS, Framer Motion, @dnd-kit |
| **Backend** | Node.js, Express.js, JWT, Bcrypt.js, Multer |
| **Databases** | MongoDB Atlas (with Mongoose), Redis |
| **Real-time** | WebSockets (ws library) |
| **DevOps & Cloud** | Docker, Docker Compose, Render (for deployment), Git, GitHub |
| **External APIs** | Google Cloud Storage (GCS), Google Maps JavaScript API, Google Geocoding API |

***

## ▶️ Running the Project Locally

To run this project on your local machine, you will need Docker Desktop installed and running.

### 1. Clone the Repository
```bash
git clone [https://github.com/Pratikkp-code/TaskMaster.git](https://github.com/Pratikkp-code/TaskMaster.git)
cd TaskMaster
```

###2. Set Up Environment Variables
This project uses two .env files for managing secrets.

Create the Root .env file:
In the project's root directory, create a file named .env and add the following variables, replacing the placeholder values with your own keys.
```code

 For JWT and Database
JWT_SECRET=YOUR_SUPER_SECRET_KEY
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING

For Redis (use these defaults for local Docker setup)
REDIS_URL=redis://redis:6379

For Google Cloud Storage
GCS_PROJECT_ID=YOUR_GCP_PROJECT_ID
GCS_BUCKET_NAME=YOUR_GCS_BUCKET_NAME

For Backend Geocoding API Key
GOOGLE_GEOCODING_API_KEY=YOUR_BACKEND_GEOCODING_API_KEY
```
Create the Client .env.local file:
In the /client directory, create a file named .env.local and add your frontend Google Maps key.

```code
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_FRONTEND_MAPS_API_KEY
```

Add the GCP Credentials File:
Place your downloaded Google Cloud service account JSON key in the /secrets directory and ensure it is named gcp-credentials.json.


3. Build and Run with Docker Compose
From the root directory of the project, run:

```bash

docker-compose up --build
```

- Frontend Client: http://localhost:3000

- Backend Services: http://localhost:4001 (Auth), 4002 (Tasks), 4003 (Real-time), 4004 (Geo)


I have updated the README file for you, ensuring the bash code block is correctly formatted and closed as you requested.

Here is the complete, updated README.

Markdown

# TaskMaster: A Full-Stack, Real-Time Task Management Application 🚀

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Google Cloud"/>
</p>

TaskMaster is a comprehensive, full-stack application designed to showcase a deep understanding of modern software architecture and development best practices. Built on a scalable, real-time microservices architecture, this project goes beyond a simple to-do list to deliver a feature-rich, production-grade user experience, fully containerized with Docker and deployed to the cloud.

[Live Demo: Link to your deployed Vercel or Render URL]

## 📋 Table of Contents
- [🚀 Project Showcase](#-project-showcase)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture & System Design](#️-architecture--system-design)
- [🛠️ Tech Stack](#️-tech-stack)
- [▶️ Running the Project Locally](#️-running-the-project-locally)
- [☁️ Deployment](#️-deployment)

***

## 🚀 Project Showcase

A visual overview of the application's core features.

| Interactive Kanban Board | Feature-Rich Task Details | Real-Time Calendar View |
| :---: | :---: | :---: |
| ![Kanban Board](URL_TO_YOUR_KANBAN_GIF) | ![Task Details Modal](URL_TO_YOUR_MODAL_GIF) | ![Calendar View](URL_TO_YOUR_CALENDAR_GIF) |

(Recommendation: Use a tool like Giphy Capture or ScreenToGif to create short screen recordings of these features and replace the placeholder links.)

***

## ✨ Key Features

This project was intentionally "over-engineered" to demonstrate a wide range of advanced skills.

- **Real-Time Collaboration**: Changes are instantly broadcast to all connected clients using WebSockets without needing a page refresh.
- **Interactive Kanban Board**: A Trello-like board with smooth, animated drag-and-drop functionality powered by `@dnd-kit` and Framer Motion.
- **Feature-Rich Task Details**: Click on any task to open a detailed modal with:
    - **File Attachments**: Upload files directly to tasks, with storage handled by Google Cloud Storage (GCS).
    - **Comments & Activity**: A real-time comment feed for task collaboration.
    - **Location Tagging**: Add a physical address to any task, which is converted to coordinates using the Google Geocoding API and displayed on an interactive Google Map.
    - **Task Priorities**: Assign Low, Medium, or High priority to tasks, visualized with colored tags.
- **Calendar View**: A full-screen calendar, powered by React Big Calendar, that displays all tasks with due dates and allows for event creation.
- **Full-Text Search**: An efficient, debounced search bar to instantly filter tasks on the board.
- **Secure Authentication**: User registration and login system using JWT (JSON Web Tokens), with password hashing via bcrypt.

***

## 🏗️ Architecture & System Design

The core of this project is its **Microservices Architecture**, designed for scalability and separation of concerns.

- **Frontend**: A standalone Next.js client responsible for all UI and user interaction.
- **Backend Services**: Four independent, containerized Node.js/Express services:
    - **Auth Service**: Manages user registration, login, and JWT generation.
    - **Task Service**: Handles all business logic for tasks, comments, and attachments.
    - **Geo Service**: A dedicated service that communicates with the Google Geocoding API.
    - **Real-time Service**: Manages all WebSocket connections and broadcasts live updates.
- **Event-Driven Communication**: Services communicate in a decoupled manner using a Redis Pub/Sub message broker. This ensures high performance and resilience.

***

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js, React, JavaScript (JSX), Tailwind CSS, Framer Motion, @dnd-kit |
| **Backend** | Node.js, Express.js, JWT, Bcrypt.js, Multer |
| **Databases** | MongoDB Atlas (with Mongoose), Redis |
| **Real-time** | WebSockets (ws library) |
| **DevOps & Cloud** | Docker, Docker Compose, Render (for deployment), Git, GitHub |
| **External APIs** | Google Cloud Storage (GCS), Google Maps JavaScript API, Google Geocoding API |

***

## ▶️ Running the Project Locally

To run this project on your local machine, you will need Docker Desktop installed and running.

### 1. Clone the Repository

```bash
git clone [https://github.com/Pratikkp-code/TaskMaster.git](https://github.com/Pratikkp-code/TaskMaster.git)
cd TaskMaster

```
2. Set Up Environment Variables
This project uses two .env files for managing secrets.

Create the Root .env file:
In the project's root directory, create a file named .env and add the following variables, replacing the placeholder values with your own keys.

```Code snippet

# For JWT and Database
JWT_SECRET=YOUR_SUPER_SECRET_KEY
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING

# For Redis (use these defaults for local Docker setup)
REDIS_URL=redis://redis:6379

# For Google Cloud Storage
GCS_PROJECT_ID=YOUR_GCP_PROJECT_ID
GCS_BUCKET_NAME=YOUR_GCS_BUCKET_NAME

# For Backend Geocoding API Key
GOOGLE_GEOCODING_API_KEY=YOUR_BACKEND_GEOCODING_API_KEY

```


Create the Client .env.local file:
In the /client directory, create a file named .env.local and add your frontend Google Maps key.

```Code snippet

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_FRONTEND_MAPS_API_KEY

```


Add the GCP Credentials File:
Place your downloaded Google Cloud service account JSON key in the /secrets directory and ensure it is named gcp-credentials.json.

### 3. Build and Run with Docker Compose
From the root directory of the project, run:

```Bash

docker-compose up --build
```


The application will be available at the following local URLs:

- Frontend Client: http://localhost:3000

- Backend Services: http://localhost:4001 (Auth), 4002 (Tasks), 4003 (Real-time), 4004 (Geo)

## ☁️ Deployment

This application is configured for continuous deployment on Render using the render.yaml file. The blueprint defines all services, databases, and secrets (managed via a Render Environment Group), allowing for automated builds and deploys on every push to the main branch.
