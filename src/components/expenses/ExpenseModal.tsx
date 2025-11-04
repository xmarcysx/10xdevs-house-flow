// Modal dialog dla dodawania/edycji wydatku
import React from "react";
import type { CategoryDTO, CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "../../types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ExpenseFormFields } from "./ExpenseFormFields";

interface ExpenseModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  expense?: ExpenseDTO;
  categories: CategoryDTO[];
  onSubmit: (data: CreateExpenseCommand | UpdateExpenseCommand) => void;
  onClose: () => void;
  isSubmitting: boolean;
  serverError?: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  mode,
  expense,
  categories,
  onSubmit,
  onClose,
  isSubmitting,
  serverError,
}) => {
  const title = mode === "add" ? "Dodaj wydatek" : "Edytuj wydatek";
  const description =
    mode === "add"
      ? "Wypełnij formularz aby dodać nowy wydatek do swojego budżetu."
      : "Zmodyfikuj dane wydatku i zapisz zmiany.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ExpenseFormFields
          initialData={expense}
          categories={categories}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={isSubmitting}
          serverError={serverError}
        />
      </DialogContent>
    </Dialog>
  );
};
