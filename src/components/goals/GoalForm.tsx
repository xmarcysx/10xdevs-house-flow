// Modal z formularzem do dodania lub edycji celu
import React from "react";
import type { CreateGoalCommand, GoalDTO, UpdateGoalCommand } from "../../types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { GoalFormFields } from "./GoalFormFields";

interface GoalFormProps {
  isOpen: boolean;
  mode: "add" | "edit";
  goal?: GoalDTO;
  onSave: (data: CreateGoalCommand | UpdateGoalCommand) => void;
  onCancel: () => void;
  loading: boolean;
}

export const GoalForm: React.FC<GoalFormProps> = ({ isOpen, mode, goal, onSave, onCancel, loading }) => {
  const title = mode === "add" ? "Dodaj cel oszczędnościowy" : "Edytuj cel oszczędnościowy";
  const description =
    mode === "add" ? "Wypełnij formularz aby dodać nowy cel oszczędnościowy." : "Zmodyfikuj dane celu i zapisz zmiany.";

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <GoalFormFields initialData={goal} onSubmit={onSave} isSubmitting={loading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
