// Formularz do wprowadzania danych wpłaty na cel oszczędnościowy
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { GoalContributionDTO } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// Schemat walidacji Zod dla wpłaty na cel
const contributionFormSchema = z.object({
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

type ContributionFormValues = z.infer<typeof contributionFormSchema>;

interface ContributionFormProps {
  contribution?: GoalContributionDTO; // Dla edycji istniejącej wpłaty
  onSubmit: (data: ContributionFormValues) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
}

export const ContributionForm: React.FC<ContributionFormProps> = ({
  contribution,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      amount: contribution?.amount || 0,
      date: contribution?.date
        ? new Date(contribution.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      description: contribution?.description || "",
    },
  });

  // Funkcja obsługująca wysłanie formularza
  const onFormSubmit = (data: ContributionFormValues) => {
    onSubmit(data);
  };

  // Funkcja obsługująca anulowanie formularza
  const handleCancel = () => {
    reset(); // Resetuj formularz do wartości domyślnych
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {contribution ? "Edytuj wpłatę" : "Dodaj nową wpłatę"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {contribution ? "Zmień dane istniejącej wpłaty" : "Wprowadź dane nowej wpłaty na cel oszczędnościowy"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Pole kwoty */}
        <div>
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Kwota (PLN) *
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            max="1000000"
            {...register("amount", { valueAsNumber: true })}
            className={`mt-1 ${errors.amount ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            placeholder="0.00"
            disabled={isSubmitting}
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>}
        </div>

        {/* Pole daty */}
        <div>
          <Label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data wpłaty *
          </Label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className={`mt-1 ${errors.date ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>}
        </div>

        {/* Pole opisu */}
        <div>
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Opis (opcjonalny)
          </Label>
          <Textarea
            id="description"
            rows={3}
            {...register("description")}
            className={`mt-1 ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            placeholder="Dodaj opcjonalny opis wpłaty..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Przyciski */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2"
            >
              Anuluj
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {contribution ? "Aktualizuję..." : "Dodaję..."}
              </>
            ) : contribution ? (
              "Aktualizuj wpłatę"
            ) : (
              "Dodaj wpłatę"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
