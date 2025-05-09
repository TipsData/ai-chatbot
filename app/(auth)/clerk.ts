import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getAuth() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return null;
  }

  return {
    id: userId,
    email: sessionClaims?.email as string,
  };
}

export async function requireAuth() {
  const user = await getAuth();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
} 