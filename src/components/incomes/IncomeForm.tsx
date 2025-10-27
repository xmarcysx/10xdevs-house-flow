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
  isSubmitting: boolean;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().split("T")[0],
      description: initialData?.description || "",
      source: initialData?.source || "",
    },
  });

  const handleFormSubmit = (data: IncomeFormValues) => {
    onSubmit({
      amount: data.amount,
      date: data.date,
      description: data.description || undefined,
      source: data.source || undefined,
    });
  };

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

      {/* Opis */}
      <div className="space-y-2">
        <Label htmlFor="description">Opis</Label>
        <Textarea
          id="description"
          placeholder="Dodatkowe informacje o wpływie..."
          rows={3}
          {...register("description")}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Źródło */}
      <div className="space-y-2">
        <Label htmlFor="source">Źródło</Label>
        <Input
          id="source"
          type="text"
          placeholder="np. Pensja, Freelance, Inwestycje..."
          {...register("source")}
          className={errors.source ? "border-red-500" : ""}
        />
        {errors.source && <p className="text-sm text-red-600">{errors.source.message}</p>}
      </div>

      {/* Przyciski */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
          {isSubmitting ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </div>
    </form>
  );
};
