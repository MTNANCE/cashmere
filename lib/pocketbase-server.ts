import PocketBase, { type RecordModel } from 'pocketbase';
import { cookies } from 'next/headers';

/**
 * Decode JWT token to extract user ID
 */
function decodeJWT(token: string): { id?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {};
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Use Buffer for Node.js environment
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[PocketBase Server] Failed to decode JWT:', error);
    return {};
  }
}

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
      const token = authCookie.value;
      
      // Decode JWT to get user data
      const payload = decodeJWT(token);
      
      // Create a minimal user record from the JWT payload
      const userRecord = payload.id ? {
        id: payload.id,
        collectionId: '_pb_users_auth_',
        collectionName: 'users',
      } as RecordModel : null;
      
      // Save the token with the user record
      pb.authStore.save(token, userRecord);
      
      console.log('[PocketBase Server] Auth configured, user ID:', payload.id);
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

