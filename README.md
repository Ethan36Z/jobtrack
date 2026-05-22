# JobTrack

JobTrack is a single-user full-stack job application tracker for organizing applications, follow-ups, interview preparation, resume versions, and company research in one place.

## Problem

Job searching often spreads important details across spreadsheets, notes apps, email threads, job boards, and memory. JobTrack solves that by giving a candidate one focused workspace to track each application, plan follow-ups, record interview notes, connect the resume version used, and collect company research before interviews.

## Portfolio Summary

JobTrack is a single-user full-stack job application tracker built as a portfolio project. The frontend is built with React, TypeScript, Vite, React Router, React Hook Form, Zod, and Zustand. The backend is an Express + TypeScript API backed by Prisma and MySQL. The app supports application CRUD, search, status filtering, dashboard stats, and a visual application pipeline. V2 expands the workflow with follow-up tracking, interview notes, resume versions, company research, and a read-only Interview Prep page. V3 adds portfolio demo readiness with seed demo data, relative demo dates, and documentation polish. The project is intentionally scoped and does not include auth, admin tooling, scraping, calendar/email sync, or AI features.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Zustand, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, Prisma
- Database: MySQL

## Key Features

- Application CRUD with detail, edit, and delete flows
- Search by company name or job title
- Status filtering and dashboard statistics
- Follow-up workflow with next actions, follow-up dates, and status labels
- Application Detail pipeline stepper for SAVED, APPLIED, INTERVIEWING, OFFER, REJECTED, and ARCHIVED states
- Interview notes attached to each application
- Resume versions CRUD with optional application-to-resume-version linking
- Company research notes attached to each application
- Interview Prep page focused on active interviewing applications
- Local seed data for portfolio walkthroughs
- Loading, error, and empty states across the main workflows

## Screenshots

Recommended screenshots:

![Dashboard](docs/screenshots/dashboard.png)
![Applications List](docs/screenshots/applications-list.png)
![Application Detail with Pipeline](docs/screenshots/application-detail-pipeline.png)
![Interview Prep](docs/screenshots/interview-prep.png)
![Resume Versions](docs/screenshots/resume-versions.png)

## Local Setup

Clone the repo, then install backend and frontend dependencies separately.

Backend:

```bash
cd backend
npm install
copy .env.example .env
```

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
```

On macOS/Linux, use `cp` instead of `copy`.

## Environment Variables

Do not commit real `.env` files. The examples are intentionally generic.

Backend `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/jobtrack"
PORT=4000
FRONTEND_ORIGIN="http://localhost:5173"
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Database Setup

Make sure MySQL is running, then create the database:

```sql
CREATE DATABASE jobtrack;
```

You can run that from a MySQL shell:

```bash
mysql -u USER -p
```

## Prisma Migrate

From `backend/`, generate the Prisma client and apply migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Prisma Seed

From `backend/`, seed local demo data:

```bash
npm run prisma:seed
```

The seed script creates or updates a known set of portfolio demo records. It does not wipe the whole database. For seeded demo applications, it refreshes their related demo interview notes and company research records so repeated demo runs stay predictable.

Seed data includes:

- 5 applications across SAVED, APPLIED, INTERVIEWING, OFFER, and REJECTED
- Relative follow-up dates, including today and upcoming dates
- 2 resume versions
- Application-to-resume-version links
- 2 interview notes
- 2 company research records

## Start Backend

From `backend/`:

```bash
npm run dev
```

The API runs at `http://localhost:4000`.

Health check:

```txt
GET http://localhost:4000/api/health
```

## Start Frontend

From `frontend/`:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Demo Workflow

1. Run migrations and seed demo data.
2. Open the Dashboard to review stats and upcoming follow-ups.
3. Open Applications to search, filter, and inspect the pipeline.
4. Open an Application Detail page to review the pipeline stepper, follow-up section, resume version, company research, and interview notes.
5. Open Interview Prep to focus on active interviewing applications.
6. Open Resume Versions to review the resumes available for linking to applications.

## Project Structure

```txt
jobtrack/
  backend/
    prisma/
      migrations/
      seed.ts
      schema.prisma
    src/
      routes/
      validation/
      server.ts
  frontend/
    src/
      api/
      components/
      pages/
      store/
      utils/
  docs/
    screenshots/
  README.md
```

## Current Status

V1 is complete:

- Application model and REST API
- Application create, read, update, and delete
- Search and status filtering
- Dashboard stats backed by real API data
- Basic loading, error, and empty states

V2 is complete:

- Follow-up workflow
- Interview notes
- Resume versions
- Company research notes
- Interview Prep page
- V2 integration polish

V3 polish completed so far:

- Portfolio demo seed data
- README cleanup
- Relative demo follow-up dates
- Application Detail pipeline stepper
- Portfolio presentation documentation

## API Overview

Applications:

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

## What I Learned

- Designing a full-stack API around real user workflows
- Modeling relational data with Prisma and MySQL
- Managing Prisma migrations across multiple feature milestones
- Building React Router page flows for list, detail, create, edit, and dashboard views
- Keeping frontend and backend TypeScript types aligned
- Using React Hook Form and Zod for practical validation
- Organizing UI state, loading states, error states, and empty states
- Controlling scope across V1, V2, and V3 without drifting into unrelated features

## Future Improvements

These are future ideas only and are not current features:

- Auth/login as optional V4
- Protected routes
- User ownership and multi-user support
- Deployment
- Better automated tests
- Calendar and email integration
- AI-assisted resume and interview prep
