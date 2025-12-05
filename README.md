This is a simple Nextjs application that allows users to upload images and comment on images.

## Tech stack: 
- Frontend: Next.js, TypeScript or Javascript, https://ant.design/ 
- Backend: Next JS API routes, prisma ORM
- Database: PostgreSQL

## Getting Started

1. Set up your environment variables, an example environment file is included under `.env.example`

You only need to set the `DATABASE_URL` environment variable.
```
DATABASE_URL=<Your PostgreSQL connection string goes here>
```

2. Perform database migrations
```
npx prisma db push
```

3. Generate the prisma client
```
npx prisma generate
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.