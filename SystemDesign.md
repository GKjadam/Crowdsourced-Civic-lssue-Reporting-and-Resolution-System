# Civic Issue Reporting System - Low-Level Design

This document outlines the Low-Level Design (LLD) for a microservices-based civic issue reporting system. The system is composed of three primary services: an Authentication Service, a Complaint Service, and a Notification Service.

---

## High-Level Architecture

The system follows a microservice architecture. All client requests (from web or mobile applications) are routed through an **API Gateway**, which acts as a single entry point. The gateway directs traffic to the appropriate downstream service. This design promotes scalability, fault isolation, and independent deployment of services.



**Core Components:**
-   **API Gateway**: Manages routing, rate limiting, and acts as the public-facing entry point.
-   **Auth Service**: Handles user identity, roles, and authentication (OTP-based).
-   **Complaint Service**: Manages the full lifecycle of complaints.
-   **Notification Service**: Sends SMS and push notifications.
-   **Cloud Storage (S3/GCS)**: Stores complaint images, with only the URLs stored in the database.
-   **Databases**: Each service maintains its own private database to ensure loose coupling.

---

## 1. Auth Service

This service is responsible for all user management and authentication tasks.

### Database Schema (`auth_db`)

**`users` table**
| Column      | Data Type    | Constraints       | Description                                  |
| :---------- | :----------- | :---------------- | :------------------------------------------- |
| `id`        | UUID         | Primary Key       | Unique identifier for the user.              |
| `name`      | VARCHAR(100) | Not Null          | User's full name.                            |
| `phone`     | VARCHAR(15)  | Not Null, Unique  | User's phone number (used for login).        |
| `password`  | VARCHAR(255) | Not Null          | Hashed password.                             |
| `role_id`   | UUID         | Foreign Key       | Links to the `roles` table.                  |
| `created_at`| TIMESTAMP    |                   | Timestamp of account creation.               |
| `updated_at`| TIMESTAMP    |                   | Timestamp of last update.                    |

**`roles` table**
| Column | Data Type   | Constraints       | Description                           |
| :----- | :---------- | :---------------- | :------------------------------------ |
| `id`   | UUID        | Primary Key       | Unique identifier for the role.       |
| `name` | VARCHAR(20) | Not Null, Unique  | Role name (CITIZEN, STAFF, ADMIN).    |

**`refresh_tokens` table**
| Column      | Data Type    | Constraints       | Description                         |
| :---------- | :----------- | :---------------- | :---------------------------------- |
| `id`        | UUID         | Primary Key       | Unique identifier for the token.    |
| `user_id`   | UUID         | Foreign Key       | Links to the `users` table.         |
| `token`     | VARCHAR(255) | Not Null, Unique  | The refresh token string.           |
| `expiry_date`| TIMESTAMP    | Not Null          | Expiry date of the token.           |

### API Endpoints (`/api/auth`)

| Method | Endpoint             | Description                                          | Request Body                        | Success Response                               |
| :----- | :------------------- | :--------------------------------------------------- | :---------------------------------- | :--------------------------------------------- |
| `POST` | `/register`          | Registers a new user (default role: Citizen).        | `{ "name", "phone", "password" }`   | `201 Created`                                  |
| `POST` | `/login/otp/send`    | Sends an OTP to the user's phone for login.          | `{ "phone" }`                       | `200 OK` `{ "message": "OTP Sent" }`           |
| `POST` | `/login/otp/verify`  | Verifies OTP and returns authentication tokens.      | `{ "phone", "otp" }`                | `200 OK` `{ "accessToken", "refreshToken" }`   |
| `POST` | `/token/refresh`     | Generates a new access token using a refresh token.  | `{ "refreshToken" }`                | `200 OK` `{ "accessToken" }`                   |
| `GET`  | `/users/{id}`        | **(Admin)** Get user details.                        | -                                   | `200 OK` `{ User Object }`                     |

---

## 2. Complaint Service

This service contains the core business logic for managing civic complaints from creation to resolution.

### Database Schema (`complaint_db`)

**`complaints` table**
| Column            | Data Type     | Constraints       | Description                                          |
| :---------------- | :------------ | :---------------- | :--------------------------------------------------- |
| `id`              | UUID          | Primary Key       | Unique identifier for the complaint.                 |
| `citizen_id`      | UUID          | Not Null          | ID of the user who raised the complaint.             |
| `description`     | TEXT          | Not Null          | Detailed description of the issue.                   |
| `image_url`       | VARCHAR(255)  | Not Null          | URL of the image in cloud storage.                   |
| `latitude`        | DECIMAL(10, 8)| Not Null          | Geographic latitude of the issue.                    |
| `longitude`       | DECIMAL(11, 8)| Not Null          | Geographic longitude of the issue.                   |
| `status`          | VARCHAR(20)   | Not Null          | e.g., CREATED, ASSIGNED, RESOLVED.                   |
| `department_id`   | UUID          | Foreign Key       | Links to the `departments` table.                    |
| `assigned_staff_id`| UUID          | Nullable          | ID of the staff member assigned to resolve.          |
| `created_at`      | TIMESTAMP     |                   | Timestamp of complaint creation.                     |
| `resolved_at`     | TIMESTAMP     | Nullable          | Timestamp when the issue was resolved.               |

**`departments` table**
| Column | Data Type    | Constraints       | Description                                      |
| :----- | :----------- | :---------------- | :----------------------------------------------- |
| `id`   | UUID         | Primary Key       | Unique identifier for the department.            |
| `name` | VARCHAR(100) | Not Null, Unique  | e.g., Electricity Dept, Cleanliness Dept.        |

### API Endpoints (`/api/complaints`)

| Method | Endpoint           | Description                                                | Request Body                                                         | Success Response                     |
| :----- | :----------------- | :--------------------------------------------------------- | :------------------------------------------------------------------- | :----------------------------------- |
| `POST` | `/`                | **(Citizen)** Creates a new complaint.                     | `{ "citizenId", "description", "imageUrl", "location", "departmentId" }` | `201 Created` `{ Complaint Object }` |
| `GET`  | `/citizen/{id}`    | **(Citizen)** Gets all complaints raised by a citizen.     | -                                                                    | `200 OK` `[ Complaint Array ]`       |
| `GET`  | `/staff/{id}`      | **(Staff)** Gets all complaints assigned to a staff member.| -                                                                    | `200 OK` `[ Complaint Array ]`       |
| `GET`  | `/`                | **(Admin)** Gets all complaints (with filters).            | -                                                                    | `200 OK` `[ Complaint Array ]`       |
| `PUT`  | `/{id}/assign`     | **(Admin)** Assigns a complaint to a staff member.         | `{ "staffId" }`                                                      | `200 OK` `{ Complaint Object }`      |
| `PUT`  | `/{id}/resolve`    | **(Staff)** Marks a complaint as resolved.                 | -                                                                    | `200 OK` `{ Complaint Object }`      |
| `GET`  | `/{id}`            | Gets details for a single complaint.                       | -                                                                    | `200 OK` `{ Complaint Object }`      |

---

## 3. Notification Service

A decoupled service for handling all outgoing communications. It is typically consumed by other backend services, not directly by clients.

### Database Schema (`notification_db`)

This schema is optional but recommended for logging and auditing notifications.

**`notification_logs` table**
| Column    | Data Type    | Constraints | Description                       |
| :-------- | :----------- | :---------- | :-------------------------------- |
| `id`      | UUID         | Primary Key | Unique log identifier.            |
| `recipient` | VARCHAR(255) | Not Null    | Phone number or user ID.          |
| `message` | TEXT         | Not Null    | The content of the notification.  |
| `type`    | VARCHAR(10)  | Not Null    | SMS, PUSH.                        |
| `status`  | VARCHAR(10)  | Not Null    | SENT, FAILED.                     |
| `sent_at` | TIMESTAMP    |             | Timestamp when sent.              |

### API Endpoints (`/api/notifications`)

These endpoints are for internal, service-to-service communication.

| Method | Endpoint | Description                                    | Request Body                           | Success Response |
| :----- | :------- | :--------------------------------------------- | :------------------------------------- | :--------------- |
| `POST` | `/sms`   | Sends an SMS message via a third-party provider. | `{ "to": "+91...", "message": "..." }` | `202 Accepted`   |
| `POST` | `/push`  | Sends a push notification to a mobile device.  | `{ "userId", "title", "body" }`        | `202 Accepted`   |

---

## Low-Level Design Diagram

The following diagram illustrates the internal components (controllers, services, repositories) within each microservice and the communication flow between them for a typical use case like creating a complaint.
