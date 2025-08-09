<<<<<<< HEAD
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d851c1df-f4c4-4d69-85f4-c9541a12f2c3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d851c1df-f4c4-4d69-85f4-c9541a12f2c3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d851c1df-f4c4-4d69-85f4-c9541a12f2c3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Deploy to Vercel (free)

1. Push this repo to GitHub.
2. Create a project at Vercel → "New Project" → Import this repo.
3. Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Environment variables (Project → Settings → Environment Variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Add any other `VITE_*` vars your app needs. Set for Production and Preview.
5. (Optional) SPA routing: keep all routes served by `index.html`.
   - Add `vercel.json` at the repo root:
     ```json
     { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
     ```
6. Deploy. Every git push builds previews; pushing to `main` updates Production.

Supabase notes:
- In Supabase Auth → URL Configuration, add your Vercel domain to Site URL/Redirect URLs.
- If you restrict storage CORS, add the Vercel domain to allowed origins.
=======
# raga-rhythm-dev
>>>>>>> 9a162c68eaedecacfa14d1e5cdf1d9cfb4e84616
