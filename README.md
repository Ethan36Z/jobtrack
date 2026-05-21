# JobTrack

JobTrack is a single-user full-stack job application tracker for managing applications, follow-ups, interview notes, resume versions, and company research notes. It is built as a portfolio-ready project with a real React frontend, Express API, Prisma data model, and MySQL database.

This project intentionally does not include authentication, admin features, deployment, Docker, scraping, browser extensions, email/calendar sync, or AI features.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Zustand, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, Prisma
- Database: MySQL

## Features

- Application CRUD with detail, edit, and delete flows
- Search by company name or job title
- Status filtering and dashboard stats
- Follow-up workflow with next actions, follow-up dates, and dashboard follow-up cards
- Interview notes attached to applications
- Resume versions CRUD and optional application-to-resume-version linking
- Company research notes attached to applications
- Loading, error, and empty states for core workflows
- Local demo seed data for portfolio walkthroughs

## Project Structure

```txt
jobtrack/
  backend/
    prisma/
    src/
  frontend/
    src/
  README.md
```

## Environment Files

Create local `.env` files from the examples. Do not commit real `.env` files.

Backend:

```bash
cd backend
copy .env.example .env
```

Example backend values:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/jobtrack"
PORT=4000
FRONTEND_ORIGIN="http://localhost:5173"
```

Frontend:

```bash
cd frontend
copy .env.example .env
```

Example frontend value:

```env
VITE_API_BASE_URL=http://localhost:4000
```

On macOS/Linux, use `cp` instead of `copy`.

## Database Setup

Make sure MySQL is running, then create the local database:

```sql
CREATE DATABASE jobtrack;
```

From a MySQL shell:

```bash
mysql -u USER -p
```

Then run the SQL command above.

## Backend Setup

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

Optional demo seed data:

```bash
npm run prisma:seed
```

The seed script creates or updates a known set of portfolio demo records. It does not wipe the whole database. For the seeded demo applications, it refreshes their related demo interview notes and company research records so the demo stays predictable.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:4000`.

Health check:

```txt
GET http://localhost:4000/api/health
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Useful Scripts

Backend:

- `npm run dev`: start the Express API in watch mode
- `npm run build`: compile TypeScript
- `npm run start`: run the compiled server
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: run Prisma migrations
- `npm run prisma:seed`: seed local demo data
- `npm run prisma:studio`: open Prisma Studio

Frontend:

- `npm run dev`: start Vite
- `npm run build`: type-check and build production assets
- `npm run preview`: preview the production build

## Completed V1

- Application model and REST API
- Application create, read, update, and delete
- Application detail page
- Search by company or job title
- Status filter
- Dashboard stats backed by real API data
- Basic loading, error, and empty states

## Completed V2

- Follow-up workflow with `nextAction` and `followUpDate`
- Dashboard follow-up section with overdue, today, upcoming, and no-date labels
- Interview notes per application
- Resume versions CRUD
- Optional application-to-resume-version relation
- Company research notes per application
- V2 integration polish for routing, layout, and README accuracy

## API Overview

Core:

- `GET /api/health`
- `GET /api/applications`
- `GET /api/applications/:id`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`

Interview notes:

- `GET /api/applications/:applicationId/interview-notes`
- `POST /api/applications/:applicationId/interview-notes`
- `PUT /api/interview-notes/:id`
- `DELETE /api/interview-notes/:id`

Resume versions:

- `GET /api/resume-versions`
- `GET /api/resume-versions/:id`
- `POST /api/resume-versions`
- `PUT /api/resume-versions/:id`
- `DELETE /api/resume-versions/:id`

Company research:

- `GET /api/applications/:applicationId/company-research`
- `POST /api/applications/:applicationId/company-research`
- `PUT /api/company-research/:id`
- `DELETE /api/company-research/:id`

## Future Improvements

- Auth/login as an optional later milestone
- Protected routes and user ownership
- Deployment
- Better automated tests
- Calendar and email reminders
- AI-assisted resume and interview prep
