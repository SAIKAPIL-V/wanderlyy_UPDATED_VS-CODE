# Wanderly - Travel Booking App

A modern travel booking application built with Next.js, Firebase Authentication, and Firestore database.

## Features

- User authentication (Email/Password + Google Sign-in)
- Browse travel listings (hotels, tours, packages)
- Make bookings
- Admin dashboard
- No Firebase Deploy required — uses local config

## Getting Started

### Prerequisites

- Node.js 18+ (check with `node -v`)
- npm 9+ (check with `npm -v`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SAIKAPIL-V/wanderlyy_UPDATED_VS-CODE.git
cd wanderlyy_UPDATED_VS-CODE
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Copy `.env.example` to `.env.local`
   - Get your Firebase config from [Firebase Console](https://console.firebase.google.com/)
   - Fill in `NEXT_PUBLIC_FIREBASE_*` values in `.env.local`

4. Start the dev server:
```bash
npm run dev
```

5. Open http://localhost:9002 in your browser

## Local Development

The app initializes Firebase using `NEXT_PUBLIC_FIREBASE_*` environment variables from `.env.local`. No `firebase deploy` is required to run locally.

### Database Setup

1. Enable **Authentication** (Email/Password and Google providers) in Firebase Console
2. Create a **Firestore** database
3. Set these Firestore rules:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /bookings/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions for Vercel, Render, or Firebase Hosting.

### Quick Vercel Deploy

1. Push to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repo
4. Add `NEXT_PUBLIC_FIREBASE_*` environment variables
5. Deploy

## Project Structure

```
src/
  app/              # Next.js app directory
    login/          # Login page
    signup/         # Signup page
    dashboard/      # User dashboard
    admin/          # Admin dashboard
  firebase/         # Firebase setup
    config.ts       # Firebase configuration
    index.ts        # SDK initialization
    provider.tsx    # Firebase context provider
  components/       # Reusable React components
    ui/             # UI component library
  lib/
    utils.ts        # Utility functions
    types.ts        # TypeScript types
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase project details:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Scripts

- `npm run dev` — Start development server (port 9002)
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm run typecheck` — Run TypeScript type checker

## Technologies

- **Next.js 15** — React framework
- **Firebase** — Authentication & Firestore
- **Tailwind CSS** — Styling
- **TypeScript** — Type safety
- **Radix UI** — Unstyled component primitives

## License

MIT

## Support

For issues or questions, open an issue on GitHub or check the docs.
