import { NextResponse } from 'next/server';
import { getAuthenticatedPB } from '@/lib/pocketbase-server';
import { transactionService } from '@/domains/transaction/api/server';
import type { TransactionType, CreateTransactionData } from '@/domains/transaction/types';

export async function GET(request: Request) {
  try {
    const pb = await getAuthenticatedPB();

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query params for filtering
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || undefined;
    const typeParam = searchParams.get('type');
    const type = typeParam ? (typeParam as TransactionType) : undefined;
    const category = searchParams.get('category') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const transactions = await transactionService.getTransactions(pb, {
      accountId,
      type,
      category,
      startDate,
      endDate,
    });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const pb = await getAuthenticatedPB();

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateTransactionData = await request.json();

    // Validate required fields
    if (!body.accountId || !body.description || !body.amount || !body.date || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = await transactionService.createTransaction(pb, body);

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

