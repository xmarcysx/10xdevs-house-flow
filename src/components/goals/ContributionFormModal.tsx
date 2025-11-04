// Modal z formularzem do dodania wpłaty na cel oszczędnościowy
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { GoalDTO, GoalContributionDTO, CreateGoalContributionCommand, UpdateGoalContributionCommand } from "../../types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Schemat walidacji Zod dla wpłaty na cel
const contributionFormSchema = z.object({
  goalId: z.string().optional(),
  amount: z
    .number({
      required_error: "Kwota jest wymagana",
      invalid_type_error: "Kwota musi być liczbą",
    })
    .positive("Kwota musi być większa od 0")
    .max(1000000, "Kwota nie może być większa niż 1 000 000")
    .refine((val) => Number(val.toFixed(2)) === val, "Kwota może mieć maksymalnie 2 miejsca po przecinku"),
  date: z
    .string()
    .min(1, "Data jest wymagana")
    .refine((val) => !isNaN(Date.parse(val)), "Data musi być prawidłową datą")
    .refine((val) => new Date(val) <= new Date(), "Data nie może być w przyszłości"),
  description: z.string().max(500, "Opis może mieć maksymalnie 500 znaków").optional(),
});

type ContributionFormData = z.infer<typeof contributionFormSchema>;

interface ContributionFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  contribution?: GoalContributionDTO;
  goals?: GoalDTO[];
  selectedGoalId?: string;
  onSave: (data: CreateGoalContributionCommand | UpdateGoalContributionCommand, goalId?: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  serverError?: string;
}

export const ContributionFormModal: React.FC<ContributionFormModalProps> = ({
  isOpen,
  mode,
  contribution,
  goals = [],
  selectedGoalId,
  onSave,
  onCancel,
  loading,
  serverError,
}) => {
  const title = mode === "add" ? "Dodaj wpłatę" : "Edytuj wpłatę";
  const description =
    mode === "add"
      ? "Wypełnij formularz aby dodać nową wpłatę na cel oszczędnościowy."
      : "Zmodyfikuj dane wpłaty i zapisz zmiany.";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      goalId: selectedGoalId || contribution?.goalId || "",
      amount: contribution?.amount || 0,
      date: contribution?.date
        ? new Date(contribution.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      description: contribution?.description || "",
    },
  });

  // Reset formularza gdy modal się otwiera/zamykają
  React.useEffect(() => {
    if (isOpen) {
      reset({
        goalId: selectedGoalId || contribution?.goalId || "",
        amount: contribution?.amount || 0,
        date: contribution?.date
          ? new Date(contribution.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        description: contribution?.description || "",
      });
    }
  }, [isOpen, contribution, selectedGoalId, reset]);

  const onSubmit = async (data: ContributionFormData) => {
    try {
      const { goalId, ...contributionData } = data;
      const finalGoalId = goalId || selectedGoalId;
      await onSave(contributionData, finalGoalId);
    } catch (error) {
      // Błędy będą obsługiwane przez rodzica
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pole wyboru celu - ukryte gdy selectedGoalId jest ustawione */}
          {(!selectedGoalId || mode === "edit") && (
            <div>
              <Label htmlFor="goalId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cel oszczędnościowy *
              </Label>
              <Select
                value={selectedGoalId || ""}
                onValueChange={(value) => setValue("goalId", value)}
                disabled={loading || isSubmitting || mode === "edit"}
              >
                <SelectTrigger className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm ${errors.goalId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Wybierz cel oszczędnościowy" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.name} (Zebrane: {goal.current_amount} / {goal.target_amount} PLN)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.goalId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.goalId.message}</p>}
            </div>
          )}

          {/* Informacja o wybranym celu */}
          {selectedGoalId && mode === "add" && (
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cel oszczędnościowy
              </Label>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-1">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {goals.find(g => g.id === selectedGoalId)?.name}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Zebrane: {goals.find(g => g.id === selectedGoalId)?.current_amount} / {goals.find(g => g.id === selectedGoalId)?.target_amount} PLN
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pole kwoty */}
          <div>
            <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kwota (PLN) *
            </Label>
            <Input
              {...register("amount", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0.01"
              max="1000000"
              id="amount"
              placeholder="0.00"
              disabled={loading || isSubmitting}
              className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm ${errors.amount ? "border-red-500" : ""}`}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>}
          </div>

          {/* Pole daty */}
          <div>
            <Label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data wpłaty *
            </Label>
            <Input
              {...register("date")}
              type="date"
              id="date"
              disabled={loading || isSubmitting}
              className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm ${errors.date ? "border-red-500" : ""}`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>}
          </div>

          {/* Pole opisu */}
          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Opis (opcjonalny)
            </Label>
            <Textarea
              {...register("description")}
              id="description"
              rows={3}
              placeholder="Dodaj opcjonalny opis wpłaty..."
              disabled={loading || isSubmitting}
              maxLength={500}
              className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{serverError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              disabled={loading || isSubmitting}
              variant="outline"
              className="px-6 py-3 border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:border-indigo-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
            >
              {loading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Zapisywanie...
                </>
              ) : mode === "add" ? (
                "Dodaj wpłatę"
              ) : (
                "Zapisz zmiany"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
