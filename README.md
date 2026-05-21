# JobTrack

JobTrack is a single-user full-stack job application tracker for managing job applications, statuses, next actions, and follow-up dates.

This V1 milestone intentionally does not include authentication, admin features, deployment, Docker, or multi-user support.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Zustand, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, Prisma
- Database: MySQL

## Project Structure

```txt
jobtrack/
  frontend/
  backend/
  README.md
```

## Create the MySQL Database

Make sure your local MySQL server is running, then create the database:

```sql
CREATE DATABASE jobtrack;
```

You can run that from a MySQL shell:

```bash
mysql -u USER -p
```

Then enter the SQL command above.

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

Update `backend/.env` with your local MySQL credentials:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/jobtrack"
PORT=4000
FRONTEND_ORIGIN="http://localhost:5173"
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Run the initial migration:

```bash
npm run prisma:migrate
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:4000`.

Health check:

```bash
GET http://localhost:4000/api/health
```

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
```

The default API URL is:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Useful Backend Scripts

- `npm run dev`: start the Express API in watch mode
- `npm run build`: compile TypeScript
- `npm run start`: run the compiled server
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: run Prisma migrations
- `npm run prisma:studio`: open Prisma Studio

## Useful Frontend Scripts

- `npm run dev`: start Vite
- `npm run build`: type-check and build production assets
- `npm run preview`: preview the production build

## V1 API Routes

- `GET /api/health`
- `GET /api/applications`
- `GET /api/applications/:id`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`

## V1 Scope

- Dashboard backed by real application data
- Application list, detail, create, edit, and delete flows
- Search by company or job title
- Status filtering
- Basic loading, error, and empty states

## Future Ideas

- Automated tests
- Interview notes
- Resume version tracking
- Company research
