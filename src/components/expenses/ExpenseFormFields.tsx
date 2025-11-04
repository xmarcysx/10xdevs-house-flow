// Formularz do wprowadzania danych wydatku
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CategoryDTO, CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

// Funkcja tworzącą schemat walidacji z kategoriami
const createExpenseFormSchema = (categories: CategoryDTO[]) =>
  z.object({
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
    category_id: z
      .string()
      .min(1, "Kategoria jest wymagana")
      .uuid("Nieprawidłowy identyfikator kategorii")
      .refine((val) => categories.some((cat) => cat.id === val), "Wybrana kategoria nie istnieje"),
    description: z.string().max(1000, "Opis może mieć maksymalnie 1000 znaków").optional(),
  });

interface ExpenseFormFieldsProps {
  initialData?: ExpenseDTO;
  categories: CategoryDTO[];
  onSubmit: (data: CreateExpenseCommand | UpdateExpenseCommand) => void;
  isSubmitting: boolean;
}

export const ExpenseFormFields: React.FC<ExpenseFormFieldsProps> = ({
  initialData,
  categories,
  onSubmit,
  isSubmitting,
}) => {
  // Utwórz schemat walidacji z kategoriami
  const expenseFormSchema = createExpenseFormSchema(categories);
  type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().split("T")[0],
      category_id: initialData?.category_id || "",
      description: initialData?.description || "",
    },
  });

  const handleFormSubmit = (data: ExpenseFormValues) => {
    const submitData = {
      amount: data.amount,
      date: data.date,
      category_id: data.category_id,
      description: data.description || undefined,
    };
    onSubmit(submitData);
  };

  // Aktualizuj wartości formularza gdy zmieni się initialData
  React.useEffect(() => {
    if (initialData) {
      reset({
        amount: initialData.amount,
        date: initialData.date,
        category_id: initialData.category_id,
        description: initialData.description || "",
      });
    }
  }, [initialData, reset]);

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
          className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 shadow-sm ${errors.amount ? "border-red-500" : ""}`}
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
          className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 shadow-sm ${errors.date ? "border-red-500" : ""}`}
        />
        {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>}
      </div>

      <div>
        <Label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kategoria *
        </Label>
        <Select value={watch("category_id")} onValueChange={(value) => setValue("category_id", value)} disabled={isSubmitting}>
          <SelectTrigger className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 shadow-sm ${errors.category_id ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Wybierz kategorię" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.category_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category_id.message}</p>}
      </div>

      <div>
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Opis
        </Label>
        <Textarea
          {...register("description")}
          id="description"
          rows={3}
          placeholder="Dodatkowe informacje o wydatku..."
          disabled={isSubmitting}
          maxLength={1000}
          className={`bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 shadow-sm ${errors.description ? "border-red-500" : ""}`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
      </div>

      {/* Przyciski */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={() => reset()}
          disabled={isSubmitting}
          variant="outline"
          className="px-6 py-3 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-red-400 dark:hover:border-red-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
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
            "Zapisz wydatek"
          )}
        </Button>
      </div>
    </form>
  );
};
