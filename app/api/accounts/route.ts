import { NextResponse } from 'next/server';
import type { Account } from '@/types/account.types';
import { accounts } from '@/data/accounts';

export async function GET(request: Request) {
  try {
    // Optional: Filter by account type if query param is provided
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let filteredAccounts = accounts;
    if (type) {
      filteredAccounts = accounts.filter(account => 
        account.type === type
      );
    }

    return NextResponse.json({ accounts: filteredAccounts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}
