// Modal z formularzem do dodania lub edycji wydatku
import React from "react";
import type { CategoryDTO, CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "../../types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ExpenseFormFields } from "./ExpenseFormFields";

interface ExpenseFormProps {
  isOpen: boolean;
  mode: "add" | "edit";
  expense?: ExpenseDTO;
  categories: CategoryDTO[];
  onSave: (data: CreateExpenseCommand | UpdateExpenseCommand) => void;
  onCancel: () => void;
  loading: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  mode,
  expense,
  categories,
  onSave,
  onCancel,
  loading,
}) => {
  const title = mode === "add" ? "Dodaj wydatek" : "Edytuj wydatek";
  const description =
    mode === "add"
      ? "Wypełnij formularz aby dodać nowy wydatek do swojego budżetu."
      : "Zmodyfikuj dane wydatku i zapisz zmiany.";

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <ExpenseFormFields initialData={expense} categories={categories} onSubmit={onSave} isSubmitting={loading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
