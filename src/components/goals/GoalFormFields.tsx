// Formularz do wprowadzania danych celu
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CreateGoalCommand, GoalDTO, UpdateGoalCommand } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Schemat walidacji formularza celu
const goalFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa celu jest wymagana")
    .max(200, "Nazwa celu może mieć maksymalnie 200 znaków")
    .regex(
      /^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,!?]+$/,
      "Nazwa celu może zawierać tylko litery, cyfry, spacje, myślniki, podkreślenia oraz znaki interpunkcyjne"
    ),
  target_amount: z
    .number({
      required_error: "Kwota docelowa jest wymagana",
      invalid_type_error: "Kwota docelowa musi być liczbą",
    })
    .positive("Kwota docelowa musi być większa od 0")
    .max(10000000, "Kwota docelowa nie może być większa niż 10 000 000")
    .refine((val) => Number(val.toFixed(2)) === val, "Kwota może mieć maksymalnie 2 miejsca po przecinku"),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalFormFieldsProps {
  initialData?: GoalDTO;
  onSubmit: (data: CreateGoalCommand | UpdateGoalCommand) => void;
  isSubmitting: boolean;
}

export const GoalFormFields: React.FC<GoalFormFieldsProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      target_amount: initialData?.target_amount || 0,
    },
  });

  const handleFormSubmit = (data: GoalFormValues) => {
    const submitData = {
      name: data.name,
      target_amount: data.target_amount,
    };
    onSubmit(submitData);
  };

  // Aktualizuj wartości formularza gdy zmieni się initialData
  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        target_amount: initialData.target_amount,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nazwa celu */}
      <div className="space-y-2">
        <Label htmlFor="name">Nazwa celu *</Label>
        <Input
          id="name"
          type="text"
          placeholder="np. Wakacje na Hawajach"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Kwota docelowa */}
      <div className="space-y-2">
        <Label htmlFor="target_amount">Kwota docelowa (PLN) *</Label>
        <Input
          id="target_amount"
          type="number"
          step="0.01"
          min="0.01"
          max="10000000"
          placeholder="0.00"
          {...register("target_amount", { valueAsNumber: true })}
          className={errors.target_amount ? "border-red-500" : ""}
        />
        {errors.target_amount && <p className="text-sm text-red-600">{errors.target_amount.message}</p>}
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
