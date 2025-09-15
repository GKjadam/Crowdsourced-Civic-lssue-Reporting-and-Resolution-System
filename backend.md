project-root/
│
├── api-gateway/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── Dockerfile
│   ├── .env
│   └── README.md
│
├── backend-services/
│   ├── issue-service/       # Handles issue reporting, CRUD, geospatial
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── middlewares/
│   │   │   ├── utils/
│   │   │   └── app.js
│   │   ├── config/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── .env
│   │   └── README.md
│   ├── notification-service/  # Handles SMS/Email async delivery
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── queue/
│   │   │   ├── utils/
│   │   │   └── app.js
│   │   ├── config/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── .env
│   │   └── README.md
│   ├── gis-service/           # Interacts with external GIS APIs
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── app.js
│   │   ├── config/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── .env
│   │   └── README.md
│
├── database/
│   ├── migrations/
│   ├── postgres/
│   │   ├── schema.sql
│   │   ├── postgis-setup.sql
│   │   └── README.md
│
├── dashboards/
│   ├── official-dashboard/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── app.js
│   │   ├── public/
│   │   ├── Dockerfile
│   │   ├── .env
│   │   └── README.md
│
├── common/            # Shared utilities, types, error handlers
│   ├── src/
│   │   ├── utils/
│   │   ├── middlewares/
│   │   └── types/
│
├── monitoring/
│   ├── logging-agent/
│   ├── dashboards/
│   └── README.md
│
├── message-queue/     # E.g. RabbitMQ setup
│   ├── docker-compose.yml
│   └── README.md
│
├── docker-compose.yml # Orchestrates all services
├── .gitignore
└── README.md
