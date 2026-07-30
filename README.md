# 🚗 Car Dealership Inventory System

A full-stack **Car Dealership Inventory System** built using **Test-Driven Development (TDD)**. The application enables users to browse, search, and purchase vehicles, while administrators can manage inventory through secure CRUD operations and vehicle restocking.

This project was developed as part of a TDD kata with a strong emphasis on clean architecture, automated testing, authentication, and transparent AI-assisted development.

---

# 📌 Project Overview

The Car Dealership Inventory System provides an end-to-end solution for managing vehicle inventory.

### Customer Features
- User Registration & Login
- Browse Available Vehicles
- Search Vehicles
- Filter Vehicles
- Purchase Vehicles
- Automatic Inventory Updates
- Out-of-Stock Handling

### Administrator Features
- Secure Admin Login
- Add New Vehicles
- Update Vehicle Information
- Delete Vehicles
- Restock Inventory
- Role-Based Authorization

---

# ✨ Features

## Authentication
- JWT Authentication
- User Registration
- User Login
- Protected Routes
- Role-Based Access Control

## Vehicle Management
- Add Vehicle
- Update Vehicle
- Delete Vehicle
- View Vehicle Inventory

## Search & Filtering
- Search by Make
- Search by Model
- Filter by Category
- Filter by Price Range
- Sorting Support

## Inventory Management
- Purchase Vehicles
- Automatic Quantity Reduction
- Vehicle Restocking
- Out-of-Stock Protection

## Testing
- Backend Unit Tests
- API Tests
- Frontend Component Tests
- Test-Driven Development Workflow

---

# 🛠 Tech Stack

## Frontend
- React
- TypeScript
- HTML5
- CSS3
- Axios

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- PostgreSQL
- Prisma ORM

## Authentication
- JWT
- bcrypt

## Testing
- Jest
- Supertest
- React Testing Library
- Vitest

---

# 🏗 Architecture

```
React Frontend
        │
        ▼
Express REST API
        │
        ▼
Authentication (JWT)
        │
        ▼
Business Logic
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL Database
```

---

# 📂 Project Structure

```
Car-Dealership/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── tests/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   └── tests/
│
├── README-assets/
├── PROMPTS.md
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Backend Setup

```bash
cd backend

npm install
```

Configure the `.env` file.

Run Prisma migrations.

```bash
npx prisma migrate dev
```

Start backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔐 Environment Variables

Backend `.env`

```env
DATABASE_URL=

JWT_SECRET=

PORT=
```

---

# ▶ Running Tests

## Backend

```bash
cd backend

npm test
```

## Frontend

```bash
cd frontend

npm test
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|----------|-----------------------------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Vehicles

| Method | Endpoint |
|----------|-----------------------------|
| GET | /api/vehicles |
| GET | /api/vehicles/search |
| POST | /api/vehicles |
| PUT | /api/vehicles/:id |
| DELETE | /api/vehicles/:id |

---

## Inventory

| Method | Endpoint |
|----------|-----------------------------|
| POST | /api/vehicles/:id/purchase |
| POST | /api/vehicles/:id/restock |

---

# 🧪 Test-Driven Development

This project followed the Test-Driven Development (TDD) methodology.

Development workflow:

1. Write failing tests (RED)
2. Implement the minimum code required (GREEN)
3. Refactor while preserving behavior (REFACTOR)

Backend features including authentication, vehicle CRUD, purchase, search, and restock were developed using this workflow.

---

# 📸 Screenshots

## Login Page

> *(Insert login.png here)*

---

## Vehicle Dashboard

> *(Insert dashboard.png here)*

---

## Search & Filters

> *(Insert search.png here)*

---

## Purchase Workflow

> *(Insert purchase.png here)*

---

## Admin Dashboard

> *(Insert admin-dashboard.png here)*

---

## Vehicle Restock

> *(Insert restock.png here)*

---

## Database Snapshot

> *(Insert prisma-database.png here)*

---

# 📊 Test Report

## Backend Tests

> *(Insert backend-tests.png here)*

---

## Frontend Tests

> *(Insert frontend-tests.png here)*

---

# 🤖 My AI Usage

AI tools were used throughout the development process to improve productivity while maintaining full understanding and ownership of the implementation.

## AI Tools Used

- GitHub Copilot
- ChatGPT

## How AI Was Used

GitHub Copilot was primarily used to generate boilerplate code, suggest implementations, and assist in writing unit tests during the TDD workflow.

ChatGPT was used for:
- Planning the development process
- Explaining technical concepts
- Reviewing implementation decisions
- Debugging issues
- Designing the TDD workflow
- Improving documentation
- Writing Git commit messages
- Reviewing project structure

All AI-generated suggestions were manually reviewed, modified where necessary, tested, and integrated only after verification.

## Reflection

Using AI significantly improved development speed, particularly for repetitive coding tasks and debugging. However, every generated solution was validated through testing and manual review before being accepted. The combination of AI assistance and Test-Driven Development helped maintain code quality while accelerating implementation.

---

# 🚀 Future Improvements

- Vehicle image upload
- Pagination
- Wishlist functionality
- Vehicle comparison
- Sales analytics dashboard
- Email notifications
- Docker support
- Cloud deployment
- CI/CD pipeline

---

# 👨‍💻 Author

**Ajay Chauhan**

Developed as part of the **Car Dealership Inventory System TDD Kata**.
