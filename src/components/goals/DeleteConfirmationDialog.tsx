// Modal potwierdzający usunięcie celu oszczędnościowego
import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  type?: "goal" | "contribution";
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  loading,
  type = "goal",
}) => {
  const isGoal = type === "goal";

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Potwierdź usunięcie</DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz usunąć {isGoal ? "ten cel oszczędnościowy" : "tę wpłatę"}? Tej operacji nie można cofnąć.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isGoal
              ? "Po usunięciu celu zostanie on trwale usunięty z systemu wraz ze wszystkimi wpłatami i nie będzie można go odzyskać."
              : "Po usunięciu wpłaty zostanie ona trwale usunięta z systemu i nie będzie można jej odzyskać."
            }
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            variant="outline"
            className="px-6 py-3 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-red-400 dark:hover:border-red-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            Nie
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading} className="min-w-[80px]">
            {loading ? "Usuwanie..." : "Tak"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
