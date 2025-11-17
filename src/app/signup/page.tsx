'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WanderlyIcon } from '@/components/icons';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendEmail } from '@/ai/flows/send-email-flow';

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: fullName });

        try {
          // Create a user document in Firestore for application data
          await setDoc(doc(firestore, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: fullName,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          console.error('Failed to create user document in Firestore:', err);
        }

        // Also save to MongoDB
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              name: fullName,
              action: 'create',
            }),
          });
          if (!response.ok) {
            console.error('Failed to create user in MongoDB');
          }
        } catch (err) {
          console.error('Error saving user to MongoDB:', err);
        }

        // Send welcome email
        await sendEmail({
          to: email,
          subject: 'Welcome to Wanderly!',
          body: `
            <h1>Welcome, ${fullName}!</h1>
            <p>Thank you for signing up for Wanderly. We're excited to have you on board.</p>
            <p>Start exploring your next adventure now!</p>
          `,
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(error.message);
      }
      console.error("Error signing up with email and password: ", error);
    }
  };
  
  if (isUserLoading || (!isUserLoading && user)) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <WanderlyIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Create an account</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <form onSubmit={handleEmailSignUp} className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                  Create account
              </Button>
            </form>
        </CardContent>
         <div className="mt-4 text-center text-sm pb-6">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
}
