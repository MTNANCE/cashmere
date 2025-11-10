import { NextResponse } from "next/server";
import { getAuthenticatedPB } from "@/lib/pocketbase-server";
import { portfolioService } from "@/domains/portfolio/api/server";
import type { UpdatePortfolioData } from "@/domains/portfolio/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/portfolios/:id - Get a single portfolio
export async function GET(request: Request, context: RouteContext) {
  try {
    const pb = await getAuthenticatedPB();

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const portfolio = await portfolioService.getPortfolio(pb, id);

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ portfolio }, { status: 200 });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

// PATCH /api/portfolios/:id - Update a portfolio
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const pb = await getAuthenticatedPB();

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as UpdatePortfolioData;

    const portfolio = await portfolioService.updatePortfolio(pb, id, body);

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ portfolio }, { status: 200 });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolios/:id - Delete a portfolio
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const pb = await getAuthenticatedPB();

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const success = await portfolioService.deletePortfolio(pb, id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
}

