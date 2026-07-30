# PROMPTS.md

# AI Prompt History

This document contains the major prompts used during the development of the **Car Dealership Inventory System**. GitHub Copilot was primarily used for code generation, while ChatGPT was used for planning, debugging, reviewing implementations, and generating documentation.

---

# Authentication

## Prompt

Implement JWT-based user authentication using Test-Driven Development (TDD).

Follow the RED → GREEN → REFACTOR workflow.

Create backend tests for:
- User registration
- User login
- Password hashing
- JWT token generation
- Protected routes

Generate only the minimum implementation required to satisfy the tests.

### AI Tool
GitHub Copilot + ChatGPT

### Outcome

- User registration implemented
- User login implemented
- JWT authentication added
- Password hashing with bcrypt
- Authorization middleware completed

---

# Vehicle CRUD

## Prompt

Implement vehicle management using TDD.

Create tests before implementation.

Support:

- Create vehicle
- Update vehicle
- Delete vehicle (Admin only)
- List all vehicles

Ensure proper validation and role-based authorization.

### AI Tool

GitHub Copilot + ChatGPT

### Outcome

- Vehicle CRUD completed
- Admin authorization added
- Validation implemented
- Backend tests passing

---

# Vehicle Search

## Prompt

Implement search functionality for vehicles.

Support searching by:

- Make
- Model

Implement advanced filters:

- Category
- Minimum price
- Maximum price
- Sorting

Write tests before implementation.

### AI Tool

GitHub Copilot + ChatGPT

### Outcome

- Search implemented
- Advanced filters completed
- Frontend and backend tests passing

---

# Vehicle Purchase

## Prompt

Implement the vehicle purchase workflow using TDD.

Requirements:

- Reduce inventory quantity
- Prevent purchasing when quantity is zero
- Disable Purchase button for out-of-stock vehicles
- Return appropriate API responses

### AI Tool

GitHub Copilot + ChatGPT

### Outcome

- Purchase endpoint implemented
- Inventory updates correctly
- Out-of-stock handling completed
- UI updated automatically

---

# Admin Dashboard

## Prompt

Create an administrator dashboard.

Allow administrators to:

- Add vehicles
- Edit vehicles
- Delete vehicles

Protect the dashboard using JWT role-based authorization.

### AI Tool

GitHub Copilot + ChatGPT

### Outcome

- Admin dashboard completed
- Vehicle CRUD interface added
- Role protection implemented

---

# Vehicle Restock

## Prompt

Implement vehicle restocking using TDD.

Requirements:

- Admin only
- Increase inventory quantity
- Validate positive quantity
- Update UI immediately after successful restock
- Create backend and frontend tests

### AI Tool

GitHub Copilot + ChatGPT

### Outcome

- Restock endpoint implemented
- Frontend integration completed
- Inventory updates correctly
- Automated tests passing

---

# Debugging

## Prompt

Review failing backend and frontend tests.

Identify the root cause instead of changing tests unnecessarily.

Ensure API contracts remain consistent and preserve existing functionality.

### AI Tool

ChatGPT

### Outcome

Resolved issues including:

- JWT role missing from token
- Request payload mismatches
- Authorization issues
- Frontend API integration
- Restock request validation

---

# Documentation

## Prompt

Generate professional project documentation.

Create:

- README.md
- AI Usage section
- Test Report
- Screenshot organization
- Git commit messages

### AI Tool

ChatGPT

### Outcome

- Professional README created
- Screenshot documentation completed
- AI usage documented
- Test report prepared

---

# Reflection

GitHub Copilot accelerated implementation by generating boilerplate code, test templates, and component scaffolding.

ChatGPT was primarily used for planning the TDD workflow, explaining concepts, reviewing generated code, debugging issues, preparing documentation, and improving overall project structure.

All AI-generated content was manually reviewed, tested, and modified where necessary before being committed to the project.
