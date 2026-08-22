# Portfolio Frontend

React and Vite frontend for Muwafak Abubakar's public portfolio and protected administration panel.

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Configure `VITE_API_URL` with the backend origin, without a trailing `/api` path:

```dotenv
VITE_API_URL=http://localhost:5000
```

The public portfolio is available at `/`, and the admin panel is available at `/admin`.

## Commands

```bash
npm run dev      # Start the development server
npm run build    # Create the production bundle
npm run lint     # Run ESLint
npm run preview  # Preview the production bundle
```

See the repository's root README for full-stack setup, API documentation, and deployment instructions.
