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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Kwota */}
      <div className="space-y-2">
        <Label htmlFor="amount">Kwota (PLN) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          max="999999.99"
          placeholder="0.00"
          {...register("amount", { valueAsNumber: true })}
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      {/* Data */}
      <div className="space-y-2">
        <Label htmlFor="date">Data *</Label>
        <Input id="date" type="date" {...register("date")} className={errors.date ? "border-red-500" : ""} />
        {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
      </div>

      {/* Kategoria */}
      <div className="space-y-2">
        <Label htmlFor="category_id">Kategoria *</Label>
        <Select value={watch("category_id")} onValueChange={(value) => setValue("category_id", value)}>
          <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
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
        {errors.category_id && <p className="text-sm text-red-600">{errors.category_id.message}</p>}
      </div>

      {/* Opis */}
      <div className="space-y-2">
        <Label htmlFor="description">Opis</Label>
        <Textarea
          id="description"
          placeholder="Dodatkowe informacje o wydatku..."
          rows={3}
          {...register("description")}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Przyciski */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
          Wyczyść
        </Button>
        <Button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0} className="min-w-[100px]">
          {isSubmitting ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </div>
    </form>
  );
};
