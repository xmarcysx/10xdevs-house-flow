// Modal dialog dla dodawania/edycji wpływu
import React from "react";
import type { IncomeDTO, IncomeFormData } from "../../types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { IncomeForm } from "./IncomeForm";

interface IncomeModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  income?: IncomeDTO;
  onSubmit: (data: IncomeFormData) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({ isOpen, mode, income, onSubmit, onClose, isSubmitting }) => {
  const title = mode === "add" ? "Dodaj wpływ" : "Edytuj wpływ";
  const description =
    mode === "add"
      ? "Wypełnij formularz aby dodać nowy wpływ do swojego budżetu."
      : "Zmodyfikuj dane wpływu i zapisz zmiany.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <IncomeForm initialData={income} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
