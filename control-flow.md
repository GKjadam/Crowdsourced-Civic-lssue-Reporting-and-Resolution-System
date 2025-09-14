# System Interaction Control Flow Diagrams

This document outlines the control flow for key user interactions within the Civic Issue Reporting System. It illustrates how the client applications (Web and Mobile) communicate with the backend microservices through an API Gateway.

---

## Architectural Overview

All client applications interact with a central **API Gateway**, which is the single entry point to the backend system. The gateway is responsible for routing requests to the appropriate microservice: **Auth Service**, **Complaint Service**, or **Notification Service**. Services communicate with each other internally, either through direct API calls or a message queue for asynchronous tasks.



---

### 1. Control Flow: User Registration and OTP Login

This flow describes how a new citizen registers and how any user logs in using an OTP sent to their phone.

```mermaid
sequenceDiagram
    participant Client as Client App (Web/Mobile)
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant Notify as Notification Service

    %% Registration
    Client->>Gateway: POST /api/auth/register (name, phone, password)
    Gateway->>Auth: POST /register (userDetails)
    activate Auth
    Note over Auth: Hashes password, creates user in 'auth_db'
    Auth-->>Gateway: 201 Created
    deactivate Auth
    Gateway-->>Client: 201 Created

    %% --- Login Starts ---
    Client->>Gateway: POST /api/auth/login/otp/send (phone)
    Gateway->>Auth: POST /login/otp/send (phone)
    activate Auth
    Note over Auth: Generates 6-digit OTP
    Auth->>Notify: POST /sms (to: phone, message: "Your OTP is XXXXXX")
    activate Notify
    Notify-->>Auth: 202 Accepted
    deactivate Notify
    Auth-->>Gateway: 200 OK
    deactivate Auth
    Gateway-->>Client: 200 OK (OTP Sent)

    Client->>Gateway: POST /api/auth/login/otp/verify (phone, otp)
    Gateway->>Auth: POST /login/otp/verify (credentials)
    activate Auth
    Note over Auth: Verifies OTP against stored value
    alt OTP is valid
        Note over Auth: Generates Access & Refresh Tokens
        Auth-->>Gateway: 200 OK (Tokens)
    else OTP is invalid
        Auth-->>Gateway: 401 Unauthorized
    end
    deactivate Auth
    Gateway-->>Client: 200 OK (Tokens) or 401 Unauthorized

Registration: The user provides their details. The request goes through the Gateway to the Auth Service, which hashes the password and saves the new user to its database.

Request OTP: To log in, the user enters their phone number. The Auth Service generates a temporary OTP.

Send SMS: The Auth Service sends a request to the Notification Service to deliver the OTP via SMS to the user's phone.

Verify OTP: The user submits the received OTP. The Auth Service validates it.

Token Generation: Upon successful verification, the Auth Service generates a JWT accessToken and refreshToken and sends them back to the client. The client must include the accessToken in the header of all subsequent requests to protected services.


control flow
sequenceDiagram
    participant Client as Mobile App
    participant Gateway as API Gateway
    participant Complaint as Complaint Service
    participant Notify as Notification Service

    Client->>Gateway: POST /api/complaints/ (complaintDetails, AuthHeader: Bearer Token)
    Note over Gateway: Gateway validates JWT token (optional)
    Gateway->>Complaint: POST / (complaintDetails)
    activate Complaint
    Note over Complaint: 1. Validates details<br/>2. Saves complaint to 'complaint_db'<br/>3. (Handles image upload to get URL)
    Complaint->>Notify: POST /sms (to: citizenPhone, message: "Complaint #123 created...")
    activate Notify
    Notify-->>Complaint: 202 Accepted
    deactivate Notify
    Complaint-->>Gateway: 201 Created (Complaint Object)
    deactivate Complaint
    Gateway-->>Client: 201 Created (Complaint Object)


Submit Complaint: The citizen fills out the complaint form on the mobile app and submits it. The request includes the JWT accessToken for authorization.

Route Request: The API Gateway routes the request to the Complaint Service.

Process Complaint: The Complaint Service validates the data and saves the new complaint record to its database. (It assumes the image has already been uploaded to cloud storage and the imageUrl is part of the request).

Send Confirmation: After successfully saving the complaint, the Complaint Service calls the Notification Service to send an SMS confirmation to the citizen.

Respond to Client: The Complaint Service returns the newly created complaint object to the client.


sequenceDiagram
    participant Admin as Web App (Admin)
    participant Gateway as API Gateway
    participant Complaint as Complaint Service
    participant Notify as Notification Service

    Admin->>Gateway: GET /api/complaints/ (AuthHeader: Bearer Token)
    Gateway->>Complaint: GET /
    activate Complaint
    Note over Complaint: Fetches all unassigned complaints from 'complaint_db'
    Complaint-->>Gateway: 200 OK (List of Complaints)
    deactivate Complaint
    Gateway-->>Admin: 200 OK (List of Complaints)

    Note over Admin: Admin selects a complaint and a staff member
    Admin->>Gateway: PUT /api/complaints/{id}/assign (staffId, AuthHeader: Bearer Token)
    Gateway->>Complaint: PUT /{id}/assign (staffId)
    activate Complaint
    Note over Complaint: Updates complaint status to 'ASSIGNED'<br/>and sets 'assigned_staff_id' in 'complaint_db'
    Complaint->>Notify: POST /sms (to: staffPhone, message: "New complaint #123 assigned to you.")
    activate Notify
    Notify-->>Complaint: 202 Accepted
    deactivate Notify
    Complaint-->>Gateway: 200 OK (Updated Complaint)
    deactivate Complaint
    Gateway-->>Admin: 200 OK (Updated Complaint)

View Complaints: The administrator logs into the web application and requests the list of complaints. The Complaint Service returns all relevant issues.

Assign Complaint: The administrator assigns a specific complaint to a staff member. The request is sent to the Complaint Service.

Update Database: The Complaint Service updates the complaint's status and links it to the staff member's ID in its database.

Notify Staff: The Complaint Service triggers the Notification Service to send an SMS to the assigned staff member, alerting them of the new task.

Confirmation: The updated complaint details are returned to the administrator's web interface.
