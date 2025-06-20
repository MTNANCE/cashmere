import { NextResponse } from "next/server";
import type { Account } from "@/types/account.types";
import { getDataSource, type AccountFilters } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Build filters from query parameters
    const filters: AccountFilters = {};

    const type = searchParams.get("type");
    if (type) {
      filters.type = type;
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

    // Use the configured data source
    const dataSource = getDataSource();
    const accounts = await dataSource.getAccounts(filters);

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
    const accountData = await request.json();

    // Use the configured data source
    const dataSource = getDataSource();
    const newAccount = await dataSource.createAccount(accountData);

    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
