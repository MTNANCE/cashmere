import { NextResponse } from "next/server";
import { getAuthenticatedPB } from "@/lib/pocketbase-server";
import { portfolioService } from "@/domains/portfolio/api/server";
import type { CreatePortfolioData } from "@/domains/portfolio/types";

// GET /api/portfolios - List all portfolios
export async function GET() {
  try {
    const pb = await getAuthenticatedPB();

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolios = await portfolioService.getPortfolios(pb);

    return NextResponse.json({ portfolios }, { status: 200 });
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}

// POST /api/portfolios - Create a new portfolio
export async function POST(request: Request) {
  try {
    const pb = await getAuthenticatedPB();

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreatePortfolioData;

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const portfolio = await portfolioService.createPortfolio(pb, body);

    return NextResponse.json({ portfolio }, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}

