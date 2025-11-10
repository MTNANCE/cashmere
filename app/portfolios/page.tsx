"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Briefcase, Trash2, Edit } from "lucide-react";
import { usePortfolios, useDeletePortfolio } from "@/hooks/use-portfolios";
import { AddPortfolioDialog } from "@/domains/portfolio/components/add-portfolio-dialog";
import { usePortfolioContext } from "@/lib/contexts/portfolio-context";

export default function PortfoliosPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: portfolios = [], isLoading } = usePortfolios();
  const { activePortfolio, setActivePortfolio } = usePortfolioContext();
  const deletePortfolio = useDeletePortfolio();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this portfolio? This will not delete the accounts within it.")) {
      await deletePortfolio.mutateAsync(id);
    }
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Portfolios</h1>
              <p className="text-muted-foreground">
                Manage your financial portfolios
              </p>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Portfolio
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : portfolios.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first portfolio to start organizing your finances
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Portfolio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <Card
                  key={portfolio.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    activePortfolio?.id === portfolio.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => setActivePortfolio(portfolio)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {portfolio.name}
                          </CardTitle>
                          {activePortfolio?.id === portfolio.id && (
                            <span className="text-xs text-primary font-medium">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement edit
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(portfolio.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {portfolio.description || "No description"}
                    </CardDescription>
                    <div className="mt-4 text-sm text-muted-foreground">
                      Created {new Date(portfolio.created).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <AddPortfolioDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}

