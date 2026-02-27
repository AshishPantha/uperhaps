# Uperhaps

> A full-stack literary publishing platform where writers share poems, novels, and creative ideas.
> 
> *Unwhispered Perhaps* - a place for publishing thoughts that never found their voice.

**Live Demo:** [poetry-web2.onrender.com](https://poetry-web2.onrender.com/) *(hosted on free tier - may take 30s to wake up)*

*I actively use this platform to publish my own literary work - you'll find 50+ poems, novels, and creative pieces I've written here.*

![Homepage](https://github.com/user-attachments/assets/a955ca79-a587-48e1-91e5-b8a4b2ceb661)
![Content View](https://github.com/user-attachments/assets/932ef31f-a93a-4815-8390-805c3f2a1037)

---

## What It Does

A community platform where anyone can:
- **Publish** poems, novels, and creative writing
- **Manage** their own content through a CMS dashboard
- **Browse** and discover works from other writers
- All content is free to read

Think Medium, but specifically for creative writing and poetry.

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/UI
- React Hook Form + Zod

**Backend**
- Payload CMS (headless CMS)
- MongoDB
- tRPC (type-safe API)
- Custom Express server

**Key Features**
- End-to-end TypeScript for type safety
- Rich text editor (Lexical) for content creation
- JWT authentication with email verification
- Fully responsive design

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/ftbhabuk/poetry-web2.git
cd poetry-web2
yarn install

# Configure .env
PAYLOAD_SECRET=your-secret-here
MONGODB_URL=mongodb://127.0.0.1:27017/poetry-web2
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
RESEND_API_KEY=your-resend-key

# Run
yarn dev
```

Visit `http://localhost:3000` for the site, `/publish` for the CMS admin panel.

---

## Project Structure

```
src/
├── app/              # Next.js pages (App Router)
├── collections/      # Payload CMS data models
├── components/       # React components
├── trpc/             # API routes and procedures
└── payload.config.ts # CMS configuration
```

---

## Why This Stack?

- **Next.js 14** - Fast SSR, SEO optimization, great DX
- **Payload CMS** - Gives every user their own content management dashboard
- **tRPC** - Type-safe API without code generation
- **TypeScript** - Catches bugs at compile time, not runtime
- **MongoDB** - Flexible schema for different content types
