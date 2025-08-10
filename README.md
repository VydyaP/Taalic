# Taalic

A web application for managing and exploring Keerthanas (Carnatic music compositions).

---

## Project Info

- **Repository:** https://github.com/VydyaP/Taalic
- **Live Demo:** https://raga-rhythm-dev.vercel.app

---

## How to Use This Project

### 1. Clone the Repository
```sh
git clone https://github.com/VydyaP/Taalic.git
cd Taalic
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Start the Development Server
```sh
npm run dev
```

The app will be available at the URL shown in your terminal (typically http://localhost:5173 or http://localhost:8080).

---

## Technologies Used
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

---

## Deployment

### Deploy to Vercel (Recommended)
1. Push this repo to GitHub.
2. Create a project at Vercel → "New Project" → Import this repo.
3. Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Set environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Any other `VITE_*` variables your app needs
5. (Optional) For SPA routing, add `vercel.json` at the repo root:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
   ```
6. Deploy. Every git push builds previews; pushing to `main` updates Production.

---

## Environment Variables & Secret Management

- **Never commit your `.env` file or secrets to the repository.**
- Always add `.env` to your `.gitignore`.
- If secrets are accidentally committed, remove them from history using tools like [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or `git filter-branch`.
- **Rotate any exposed secrets immediately** in your provider's dashboard (e.g., Google Cloud, Supabase).

#### Example `.env` (do not commit this file)
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
# Add other VITE_* variables as needed
```

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)
