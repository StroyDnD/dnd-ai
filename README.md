# D&D Campaign Generator

A web application that enables Dungeon Masters to create customized D&D campaign outlines using AI. Built with React, TypeScript, Vite, and OpenAI.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Authentication](#authentication)
- [API & Template System](#api--template-system)
- [Extending the System](#extending-the-system)
- [Deployment](#deployment)
- [Analytics](#analytics)
- [ESLint Configuration](#eslint-configuration)

---

## Features

- AI-powered D&D campaign generation (plot, NPCs, locations, encounters)
- User authentication (Supabase)
- Campaign saving (Supabase)
- Map and illustration generation (openAI / supabase)
- Responsive UI with Tailwind CSS
- Analytics via Posthog

---

## Project Structure

```
src/
  components/        # UI components
  context/           # React context providers
  data/              # Static data (prompt definitions)
  lib/               # API services, templates, config
  pages/             # Route-level pages
  providers/         # Auth provider
  utils/             # Utility functions
  index.css          # Tailwind and global styles
  main.tsx           # App entry point
```

---

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/dnd-ai.git
   cd dnd-ai
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
VITE_OPENAI_API_KEY=your_openai_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PUBLIC_POSTHOG_KEY=your_posthog_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

> **Note:** Never commit your `.env` file. It is already in `.gitignore`.

---

## Running Locally

Start the development server:

```sh
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## Authentication

- Uses [Supabase](https://supabase.com/) for user authentication.
- Register or log in with email and password.
- Auth state is managed via `AuthProvider` in `src/providers/AuthProvider.tsx`.

---

## API & Template System

- **OpenAI** is used for campaign/story generation.
- Templates for different genres are in [`src/lib/templates/`](src/lib/templates/).
- API services are in [`src/lib/api/`](src/lib/api/).
- To generate a campaign, user answers are formatted into a prompt template and sent to OpenAI.

---

## Extending the System

To add a new genre or campaign type:

1. Create a new template file in `src/lib/templates/` (e.g., `mystery.ts`).
2. Define the prompt answers interface and template generator function.
3. Add the new genre to the `TemplateMap` in [`src/lib/templates/index.ts`](src/lib/templates/index.ts).
4. Update `StoryService` if needed.

---

## Deployment

- Deployed via [Netlify](https://app.netlify.com/sites/stroy-dnd/overview).
- Merge to `main` branch to trigger deployment.

---

## Analytics

- Uses [Posthog](https://us.posthog.com/project/151544) for event tracking.
- Configured via environment variables.

---

## ESLint Configuration

- ESLint is set up for TypeScript and React.
- See [`eslint.config.js`](eslint.config.js) for details.
- To enable type-aware linting, update `parserOptions` and use the recommended configs as described in comments.

---

## Troubleshooting

- If you see errors related to missing environment variables, ensure your `.env` file is present and correct.
- For OpenAI API issues, check your API key and usage limits.
- For Supabase issues, verify your project URL and anon key.

---

## License

MIT (or your chosen license)
