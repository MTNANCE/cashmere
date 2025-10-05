import type { AccountType, AccountFilters } from "@/domains/account/types";
import { accountService } from "@/domains/account/api/server";
import { NextResponse } from "next/server";
import { getAuthenticatedPB } from "@/lib/pocketbase-server";

export async function GET(request: Request) {
  try {
    const pb = await getAuthenticatedPB();
    
    // Check if user is authenticated
    if (!pb.authStore.isValid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Build filters from query parameters
    const filters: AccountFilters = {};

    const type = searchParams.get("type");
    if (type && (type === 'bank' || type === 'credit')) {
      filters.type = type as AccountType;
    }

    const institution = searchParams.get("institution");
    if (institution) {
      filters.institution = institution;
    }

    const minBalance = searchParams.get("minBalance");
    if (minBalance) {
      filters.minBalance = Number.parseFloat(minBalance);
    }

    const maxBalance = searchParams.get("maxBalance");
    if (maxBalance) {
      filters.maxBalance = Number.parseFloat(maxBalance);
    }

    // Use domain service
    const accounts = await accountService.getAccounts(pb, filters);

    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const pb = await getAuthenticatedPB();
    
    // Check if user is authenticated
    if (!pb.authStore.isValid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const accountData = await request.json();

    // Validate required fields
    if (!accountData.name || !accountData.type || !accountData.institution) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, institution" },
        { status: 400 }
      );
    }

    // Validate balance is a number
    if (typeof accountData.balance !== 'number') {
      return NextResponse.json(
        { error: "Balance must be a number" },
        { status: 400 }
      );
    }

    // Use domain service
    const newAccount = await accountService.createAccount(pb, accountData);

    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
