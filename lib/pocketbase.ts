import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8119');

// Enable auto-cancellation of pending requests
pb.autoCancellation(false);

// Enable cookie-based auth storage for SSR
if (typeof window !== 'undefined') {
  // Client-side: store auth in localStorage (default)
  pb.authStore.onChange(() => {
    // Save auth token to cookie for server-side access
    if (pb.authStore.isValid) {
      document.cookie = `pb_auth=${pb.authStore.token}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      document.cookie = 'pb_auth=; path=/; max-age=0';
    }
  });
}

export default pb;

// Type-safe collection names
export const Collections = {
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
} as const;

