# Car Dealership Inventory System (Scaffold)

This repository contains a scaffolded full-stack project for a Car Dealership Inventory System. It includes a TypeScript Node.js backend with Prisma + SQLite, and a React frontend using Vite, Tailwind CSS, and Axios.

Setup (requires Node.js >= 16):

1. Install dependencies for both projects:

```bash
cd "c:\Users\Ajay Chauhan\Desktop\Car-Dealership"
npm install --prefix backend
npm install --prefix frontend
```

2. Backend: generate Prisma client and run migrations (no schema changes yet):

```bash
npm --prefix backend run prisma:generate
```

3. Run development servers:

```bash
npm run dev:backend
npm run dev:frontend
```

Available scripts (root):

- `dev:backend`, `dev:frontend`, `build:backend`, `build:frontend`, `test:backend`, `lint`, `format`

Notes:

- This scaffold contains no business logic or API endpoints yet — only directory structure, configs, and minimal example files to get started.
