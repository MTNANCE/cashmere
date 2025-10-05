import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

/**
 * Get an authenticated PocketBase client for server-side use
 * This reads the auth token from cookies
 */
export async function getAuthenticatedPB(): Promise<PocketBase> {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8119');
  
  // Get the auth token from cookies
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');
  
  if (authCookie?.value) {
    try {
      // The cookie contains just the token string
      pb.authStore.save(authCookie.value, null);
    } catch (error) {
      console.error('[PocketBase Server] Failed to set auth token:', error);
    }
  }
  
  return pb;
}

/**
 * Get an authenticated PocketBase client from request headers
 * This reads the Authorization header
 */
export function getPBFromAuthHeader(authHeader: string | null): PocketBase {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8119');
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    pb.authStore.save(token, null);
  }
  
  return pb;
}

