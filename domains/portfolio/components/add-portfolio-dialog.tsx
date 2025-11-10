"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePortfolio } from "@/hooks/use-portfolios";
import type { CreatePortfolioData } from "../types";

interface AddPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPortfolioDialog({ open, onOpenChange }: AddPortfolioDialogProps) {
  const [formData, setFormData] = useState<CreatePortfolioData>({
    name: "",
    description: "",
  });

  const createPortfolio = useCreatePortfolio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      await createPortfolio.mutateAsync(formData);
      
      // Reset form and close dialog
      setFormData({ name: "", description: "" });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create portfolio:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Portfolio</DialogTitle>
            <DialogDescription>
              Organize your accounts into portfolios for better financial management
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Portfolio Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Personal, Business, Investment"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What is this portfolio for?"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createPortfolio.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPortfolio.isPending || !formData.name.trim()}>
              {createPortfolio.isPending ? "Creating..." : "Create Portfolio"}
            </Button>
          </DialogFooter>

          {createPortfolio.isError && (
            <p className="text-sm text-red-500 mt-2">
              Failed to create portfolio. Please try again.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

