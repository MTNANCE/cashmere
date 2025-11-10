import type { Portfolio, CreatePortfolioData, UpdatePortfolioData } from "../types";
import type { RecordModel } from "pocketbase";
import type PocketBase from "pocketbase";
import { PBCollections, type PortfolioRecord } from "@/types/pocketbase-types";

// Map PocketBase record to Portfolio type
function mapToPortfolio(record: PortfolioRecord): Portfolio {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    user: record.user,
  };
}

export const portfolioService = {
  // Get all portfolios with optional filters
  async getPortfolios(pb: PocketBase): Promise<Portfolio[]> {
    try {
      const records = await pb.collection(PBCollections.PORTFOLIOS).getFullList<PortfolioRecord>();

      return records.map(mapToPortfolio);
    } catch (error) {
      console.error("Error fetching portfolios from PocketBase:", error);
      if (error && typeof error === "object" && "response" in error) {
        console.error("PocketBase error details:", JSON.stringify(error.response, null, 2));
        if ("data" in error && error.data) {
          console.error("PocketBase error data:", JSON.stringify(error.data, null, 2));
        }
      }
      throw error;
    }
  },

  // Get single portfolio by ID
  async getPortfolio(pb: PocketBase, id: string): Promise<Portfolio | null> {
    try {
      const record = await pb.collection(PBCollections.PORTFOLIOS).getOne<PortfolioRecord>(id);
      return mapToPortfolio(record);
    } catch (error) {
      console.error("Error fetching portfolio from PocketBase:", error);
      return null;
    }
  },

  // Create new portfolio
  async createPortfolio(pb: PocketBase, portfolioData: CreatePortfolioData): Promise<Portfolio> {
    try {
      // Get the authenticated user ID
      const userId = pb.authStore.record?.id || pb.authStore.model?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const record = await pb.collection(PBCollections.PORTFOLIOS).create<PortfolioRecord>({
        ...portfolioData,
        user: userId,
      });

      return mapToPortfolio(record);
    } catch (error) {
      console.error("Error creating portfolio in PocketBase:", error);
      if (error && typeof error === "object" && "response" in error) {
        console.error("PocketBase error details:", JSON.stringify(error.response, null, 2));
      }
      throw error;
    }
  },

  // Update existing portfolio
  async updatePortfolio(pb: PocketBase, id: string, updates: UpdatePortfolioData): Promise<Portfolio | null> {
    try {
      const record = await pb.collection(PBCollections.PORTFOLIOS).update<PortfolioRecord>(id, updates);
      return mapToPortfolio(record);
    } catch (error) {
      console.error("Error updating portfolio in PocketBase:", error);
      return null;
    }
  },

  // Delete portfolio
  async deletePortfolio(pb: PocketBase, id: string): Promise<boolean> {
    try {
      await pb.collection(PBCollections.PORTFOLIOS).delete(id);
      return true;
    } catch (error) {
      console.error("Error deleting portfolio from PocketBase:", error);
      return false;
    }
  },
};

