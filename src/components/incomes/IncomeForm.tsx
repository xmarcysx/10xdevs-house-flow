// Formularz do wprowadzania danych wpływu
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { IncomeDTO, IncomeFormData } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// Schemat walidacji Zod
const incomeFormSchema = z.object({
  amount: z
    .number({
      required_error: "Kwota jest wymagana",
      invalid_type_error: "Kwota musi być liczbą",
    })
    .positive("Kwota musi być większa od 0")
    .max(999999.99, "Kwota nie może być większa niż 999 999.99")
    .refine((val) => Number(val.toFixed(2)) === val, "Kwota może mieć maksymalnie 2 miejsca po przecinku"),
  date: z
    .string()
    .min(1, "Data jest wymagana")
    .refine((val) => !isNaN(Date.parse(val)), "Data musi być prawidłową datą")
    .refine((val) => new Date(val) <= new Date(), "Data nie może być w przyszłości"),
  description: z.string().max(500, "Opis może mieć maksymalnie 500 znaków").optional(),
  source: z.string().max(100, "Źródło może mieć maksymalnie 100 znaków").optional(),
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

interface IncomeFormProps {
  initialData?: IncomeDTO;
  onSubmit: (data: IncomeFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  serverError?: string;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().split("T")[0],
      description: initialData?.description || "",
      source: initialData?.source || "",
    },
  });

  // Reset formularza gdy initialData się zmienia
  React.useEffect(() => {
    reset({
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().split("T")[0],
      description: initialData?.description || "",
      source: initialData?.source || "",
    });
  }, [initialData, reset]);

  const handleFormSubmit = async (data: IncomeFormValues) => {
    try {
      await onSubmit({
        amount: data.amount,
        date: data.date,
        description: data.description || undefined,
        source: data.source || undefined,
      });
    } catch (error) {
      // Błędy będą obsługiwane przez rodzica
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kwota (PLN) *
        </Label>
        <Input
          {...register("amount", { valueAsNumber: true })}
          type="number"
          id="amount"
          step="0.01"
          min="0"
          max="999999.99"
          placeholder="0.00"
          disabled={isSubmitting}
          className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm ${errors.amount ? "border-red-500" : ""}`}
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>}
      </div>

      <div>
        <Label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Data *
        </Label>
        <Input
          {...register("date")}
          type="date"
          id="date"
          disabled={isSubmitting}
          className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm ${errors.date ? "border-red-500" : ""}`}
        />
        {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>}
      </div>

      <div>
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Opis
        </Label>
        <Textarea
          {...register("description")}
          id="description"
          rows={3}
          placeholder="Dodatkowe informacje o wpływie..."
          disabled={isSubmitting}
          maxLength={500}
          className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm ${errors.description ? "border-red-500" : ""}`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Źródło
        </Label>
        <Input
          {...register("source")}
          type="text"
          id="source"
          placeholder="np. Pensja, Freelance, Inwestycje..."
          disabled={isSubmitting}
          maxLength={100}
          className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm ${errors.source ? "border-red-500" : ""}`}
        />
        {errors.source && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.source.message}</p>}
      </div>

      {serverError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{serverError}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          variant="outline"
          className="px-6 py-3 border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:border-indigo-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          Anuluj
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Zapisywanie...
            </>
          ) : (
            "Zapisz wpływ"
          )}
        </Button>
      </div>
    </form>
  );
};
