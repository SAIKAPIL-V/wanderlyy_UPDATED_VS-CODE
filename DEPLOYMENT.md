# Deployment Guide for Wanderly

This guide covers deploying the Next.js + Firebase app to production without requiring `firebase deploy`.

## Option 1: Vercel (Recommended)

Vercel is the best choice for Next.js apps. Zero-config, fast, and integrates seamlessly with Git.

### Steps:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/wanderly.git
   git push -u origin main
   ```

2. **Create a Vercel account** at https://vercel.com and sign in with GitHub.

3. **Import project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

4. **Set environment variables**
   - Go to **Settings → Environment Variables**
   - Add the following (get values from your Firebase console):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAWcdUtLloUK-94E7zRdT_ro5DECHgAuts
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-8197606483-51e56.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-8197606483-51e56
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-8197606483-51e56.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=693773864041
   NEXT_PUBLIC_FIREBASE_APP_ID=1:693773864041:web:a049dcd8607e76706026f8
   ```
   - **Note:** `NEXT_PUBLIC_*` prefix makes them available client-side (safe per Firebase docs; these are public keys)

5. **Update `src/firebase/config.ts`** to read from env vars:
   ```typescript
   export const firebaseConfig = {
     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
   };
   ```

6. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Your app is live at `your-project.vercel.app`

### Auto-deploy on Git push
Once connected, every push to `main` auto-deploys. Preview deployments on PRs too.

---

## Option 2: Render

Good alternative if you prefer full control or need persistent background processes.

### Steps:

1. **Push code to GitHub** (same as Vercel Step 1)

2. **Create a Render account** at https://render.com

3. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Instance type: Free (or Starter+)

4. **Set environment variables**
   - In the Web Service settings, add the same `NEXT_PUBLIC_*` vars as Vercel (Step 4)
   - **Note:** Render calls them "Environment" in the dashboard

5. **Deploy**
   - Click "Create Web Service"
   - Render builds and deploys
   - Your app is live at `your-app.onrender.com`

### Auto-deploy
Render auto-redeploys on Git push to the connected branch.

---

## Option 3: Firebase Hosting (with Cloud Run backend)

If you want to stay fully within Firebase ecosystem:

### Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

**Note:** This uses `firebase deploy` for hosting only (not the full Firebase App Hosting). You still don't need to configure the entire Firebase backend via CLI.

---

## Recommended: Vercel + Environment Variables

For the best experience:

1. **Use Vercel** for hosting (simplest, fastest, best DX)
2. **Use `NEXT_PUBLIC_*` env vars** for Firebase config (secure, environment-specific)
3. **Use GitHub for version control** (auto-deploy on push)

### Quick checklist:
- [ ] Push code to GitHub
- [ ] Create Vercel account (sign in with GitHub)
- [ ] Import project to Vercel
- [ ] Add `NEXT_PUBLIC_FIREBASE_*` env vars in Vercel Settings
- [ ] Update `src/firebase/config.ts` to read env vars
- [ ] Deploy
- [ ] Test login/signup at your live URL

---

## Security Considerations

- **Client-side config:** Firebase API keys are safe to expose on the client (they're public keys). Security is enforced via Firestore rules.
- **Firestore rules:** Make sure your rules allow:
  - Unauthenticated users to create accounts (signup)
  - Authenticated users to read/write their own `users/{uid}` doc
  - Example rule:
    ```
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    ```
- **Secrets:** If you add server-side Admin SDK routes, store the service account JSON as a secret env var (not `NEXT_PUBLIC_`).

---

## Domain & Custom DNS

- **Vercel:** Add custom domain in Project Settings → Domains
- **Render:** Add custom domain in Web Service settings → Custom Domain

---

## Troubleshooting

### Build fails with "API key not found"
- Check that env vars are set in the deployment platform (not just locally in `.env.local`)
- Vercel/Render rebuild after env var changes; no manual redeploy needed

### Blank page or 404
- Check the deployment logs (Vercel/Render dashboard)
- Confirm the build command succeeded

### Auth not working
- Verify Firebase Firestore rules allow your operations
- Check browser console for Firebase errors
- Ensure `NEXT_PUBLIC_FIREBASE_*` vars are set correctly

---

## Next Steps

1. Choose a platform (Vercel recommended)
2. Follow the steps above
3. Test signup, login, and admin page on live URL
4. Add custom domain if needed

Questions? See https://vercel.com/docs or https://render.com/docs.
