// Modal potwierdzający usunięcie wydatku
import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Potwierdź usunięcie</DialogTitle>
          <DialogDescription>Czy na pewno chcesz usunąć ten wydatek? Tej operacji nie można cofnąć.</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Po usunięciu wydatku zostanie on trwale usunięty z systemu i nie będzie można go odzyskać.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="min-w-[80px]">
            Anuluj
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading} className="min-w-[80px]">
            {loading ? "Usuwanie..." : "Usuń"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
