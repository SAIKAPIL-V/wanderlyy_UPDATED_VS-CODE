# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Local Firebase setup (no `firebase deploy` required)

If you want to run the app locally without using `firebase deploy` or Firebase Hosting automation, this project initializes Firebase from the local `src/firebase/config.ts` file.

- Copy your Firebase project's config values into `src/firebase/config.ts` (the file already exists in the repo).
- Run the app locally with your normal Next.js dev server:

```powershell
npm install
npm run dev
```

- The app will initialize Firebase using the values in `src/firebase/config.ts`, so you do not need to run `firebase deploy` for the app to connect to Auth / Firestore during development.

Security note: Do not commit production secrets to public repositories. Prefer using environment variables or a secrets manager for production builds.
