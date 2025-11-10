export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  user: string;
}

export interface CreatePortfolioData {
  name: string;
  description?: string;
}

export interface UpdatePortfolioData {
  name?: string;
  description?: string;
}

