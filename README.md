# Crowdsourced-Civic-lssue-Reporting-and-Resolution-System
make it pride
# CityFix: Civic Issue Reporting Platform

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-18-blueviolet)
![Flutter](https://img.shields.io/badge/Flutter-3.x-cyan)

CityFix is a comprehensive, full-stack application designed to bridge the communication gap between citizens and their municipal corporations. It empowers citizens to report local civic issues in real-time, providing administrators with a powerful dashboard to track, manage, and resolve these problems efficiently.

## 🚀 Key Features

* **Citizen Mobile App (Flutter):**
    * Secure user registration with OTP verification.
    * Intuitive complaint submission with image capture and automatic GPS location tagging.
    * Categorization of complaints for routing to the correct department.
    * Real-time tracking of complaint status.
    * Profile management and view complaint history.
* **Administrative Web Portal (React):**
    * **Role-Based Access Control** for Citizens, Staff, and Administrators.
    * **Admin Dashboard:** A "god-mode" view with a live map of all issues, key performance indicators (KPIs), and advanced filtering.
    * **Staff Dashboard:** A focused task-management view showing only the complaints relevant to their department.
    * **Citizen Portal:** A web view for citizens to track their submitted issues.

## 🏛️ Architecture & System Design

The application is built on a robust, scalable 3-tier architecture.

****

### Tech Stack

| Component              | Technology                                   |
| ---------------------- | -------------------------------------------- |
| **Backend** | Java 17, Spring Boot 3.x, Spring Security    |
| **Database** | Oracle SQL                                   |
| **Frontend (Web)** | React 18, TypeScript, Material-UI (MUI)      |
| **Frontend (Mobile)** | Flutter 3.x                                  |
| **Containerization** | Docker, Docker Compose                       |
| **Deployment (Cloud)** | Kubernetes (AWS EKS), S3, RDS, ELB           |

### Diagrams

*(Note: Generate these images and place them in a `/docs/diagrams` folder in your repository.)*

1.  **Database Class Diagram:** Shows the structure of our core entities and their relationships.
    ![Database Class Diagram](docs/diagrams/db-class-diagram.png)

2.  **Spring Boot Request Flow:** Illustrates how a request travels through the layers of our backend.
    ![Spring Boot Request Flow](docs/diagrams/request-flow-diagram.png)

3.  **Spring Boot Application Class Diagram:** Details the key classes and their dependencies within the backend application.
    ![Spring Boot Application Class Diagram](docs/diagrams/spring-boot-class-diagram.png)

## 🛠️ API Endpoints

The backend exposes a comprehensive REST API for all client applications. All endpoints are prefixed with `/api/v1`.

| Method | Endpoint                          | Role Required | Description                                                  |
| ------ | --------------------------------- | ------------- | ------------------------------------------------------------ |
| `POST` | `/auth/register`                  | Public        | Register a new citizen and send OTP.                         |
| `POST` | `/auth/verify-otp`                | Public        | Verify OTP to complete registration.                         |
| `POST` | `/auth/login`                     | Public        | Authenticate a user and return a JWT token.                  |
| `POST` | `/complaints`                     | CITIZEN       | Create a new complaint (multipart request with image).       |
| `GET`  | `/complaints/my-complaints`       | CITIZEN       | Get a list of complaints filed by the current user.          |
| `GET`  | `/complaints`                     | ADMIN, STAFF  | Get all complaints with filters (auto-filtered for STAFF).   |
| `GET`  | `/complaints/{id}`                | Authenticated | Get details for a single complaint.                          |
| `PUT`  | `/complaints/{id}/status`         | STAFF, ADMIN  | Update the status of a complaint.                            |
| `GET`  | `/users/me`                       | Authenticated | Get the profile of the current user.                         |
| `GET`  | `/meta/departments`               | Public        | Get a list of all municipal departments.                     |

## 🏁 Getting Started (Local Development)

Follow these instructions to get the entire application running on your local machine.

### Prerequisites

* Java JDK 17+
* Maven 3.8+
* Node.js 18+
* Flutter SDK 3.x
* Docker & Docker Compose
* An Oracle Database instance

### 1. Backend Setup (Spring Boot)

```bash
# Navigate to the backend directory
cd backend

# Update application.properties with your Oracle DB credentials
# src/main/resources/application.properties
spring.datasource.url=...
spring.datasource.username=...
spring.datasource.password=...

# Run the application
mvn spring-boot:run
```
The backend will be running on `http://localhost:8080`.

### 2. Frontend Setup (React Admin Panel)

```bash
# Navigate to the web frontend directory
cd frontend-web

# Install dependencies
npm install

# Run the application
npm start
```
The React app will be running on `http://localhost:3000`.

### 3. Mobile App Setup (Flutter)

```bash
# Navigate to the mobile app directory
cd frontend-mobile

# Get dependencies
flutter pub get

# Run the application on an emulator or connected device
flutter run
```

## 👥 Team Roles

* **Team Lead & Backend Dev 1:** [Ghanshyam]
* **Backend Dev 2 / DB Admin:** [Ruchi]
* **React Frontend Dev 1:** [Kajal]
* **React Frontend Dev 2:** [Neha,Khushbu]
* **Flutter Mobile Dev:** [Tejas]
* **DevOps / QA Lead:** [Ghanshyam]

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
