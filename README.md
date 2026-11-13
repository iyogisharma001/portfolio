# Yogesh Sharma — Portfolio

A full-stack developer portfolio: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Prisma and PostgreSQL.

- **Hero** with a typewriter headline and a working mini terminal (`help`, `whoami`, `skills`, …)
- **About / skills matrix**, **experience timeline**, **education & achievements**
- **Projects** grid with category filters, a detail dialog and per-visitor endorsements
- **Contact form** validated with Zod on the client (React Hook Form) and again on the server, stored in PostgreSQL, with an email notification through Resend (mocked when no API key is set)
- **Analytics** without cookies: page views are stored with a salted hash that rotates daily

## Requirements

- Node.js 20.9 or newer
- PostgreSQL 14 or newer — either your own, or Docker for the bundled `docker-compose.yml`

## Getting started

```bash
# 1. Install dependencies (also generates the Prisma client)
npm install

# 2. Create your environment file
cp .env.example .env

# 3. Start PostgreSQL (skip if you use your own database)
npm run db:up

# 4. Create the tables
npx prisma migrate dev

# 5. Load the projects, skills and profile
npx prisma db seed

# 6. Start the development server
npm run dev
```

Open <http://localhost:3000>.

The site still renders without a database: projects and skills fall back to the typed content in `lib/data.ts`. Endorsements and analytics are switched off in that case, and contact messages are only delivered if email is configured.

## Environment variables

Set these in `.env` (see `.env.example`).

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. The default matches `docker-compose.yml` (port **5433**). |
| `NEXT_PUBLIC_SITE_URL` | In production | Public URL, used for canonical links, the sitemap and social cards. |
| `VISITOR_HASH_SALT` | In production | Salt for hashing visitor IPs. Generate with `openssl rand -hex 32`. |
| `RESEND_API_KEY` | No | Enables real email notifications. Empty means emails are logged to the server console. |
| `CONTACT_TO_EMAIL` | No | Inbox that receives contact messages. Defaults to the address in `lib/data.ts`. |
| `CONTACT_FROM_EMAIL` | No | Sender address. Must be on a domain verified in Resend. |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Serve the production build |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |
| `npm run db:up` / `npm run db:down` | Start / stop the local PostgreSQL container |
| `npm run db:migrate` | `prisma migrate dev` — create and apply migrations in development |
| `npm run db:deploy` | `prisma migrate deploy` — apply migrations in production |
| `npm run db:seed` | Upsert the content from `lib/data.ts` into the database |
| `npm run db:studio` | Open Prisma Studio to read messages, endorsements and page views |

## Editing content

All content lives in **`lib/data.ts`**: profile, bio, skills, projects, experience, education and achievements. After editing, run `npm run db:seed` to push the changes to the database (the seed is idempotent). Project and skill queries are cached for an hour, so restart the server to see database changes immediately.

Things worth filling in:

- `projects[].githubUrl` currently points at the GitHub profile — replace with each repository URL.
- `projects[].liveUrl` is `null`; set it to show a "Live demo" link.
- `achievements[].links` — add LeetCode / GeeksforGeeks profile links.
- `public/Yogesh_Resume.pdf` — replace the file to update the downloadable resume.

## Project structure

```
actions/        Server Actions: contact form, analytics, endorsements
app/            Layout, page, error boundaries, robots, sitemap, social image
components/     UI, grouped by section (hero, projects, contact) plus ui/ primitives
lib/            Content, Prisma client, cached queries, Zod schemas, email, visitor hashing
prisma/         Schema, migrations and seed script
public/         Static files (resume)
```

### Database models

`User`, `Project`, `Skill`, `Message`, `Endorsement` and `PageView` — see `prisma/schema.prisma`.

### How the contact form works

1. React Hook Form validates against `contactSchema` (`lib/validations.ts`) in the browser.
2. `submitContact` (`actions/contact.ts`) re-validates with the same schema on the server.
3. A hidden honeypot field silently drops bot submissions.
4. Submissions are limited to 5 per hour per visitor, keyed on a salted IP hash.
5. The message is saved to the `Message` table, then a notification email is sent.

## Deployment

1. Provision a PostgreSQL database and set the environment variables above on your host.
2. Run `npm run db:deploy`, then `npm run db:seed` once.
3. Build with `npm run build` and serve with `npm run start` (or deploy to any platform that supports Next.js).

Behind a proxy, make sure `x-forwarded-for` is set so rate limiting and endorsements can tell visitors apart.
