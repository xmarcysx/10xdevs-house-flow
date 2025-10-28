// Modal z formularzem do dodania lub edycji kategorii
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CategoryDTO, CreateCategoryCommand, UpdateCategoryCommand } from "../../types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Schemat walidacji dla formularza kategorii
const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa kategorii jest wymagana")
    .max(100, "Nazwa kategorii może mieć maksymalnie 100 znaków")
    .regex(
      /^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
      "Nazwa kategorii może zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia"
    )
    .refine((val) => val.trim().length > 0, "Nazwa kategorii nie może zawierać tylko spacji"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  category?: CategoryDTO;
  onSave: (data: CreateCategoryCommand | UpdateCategoryCommand) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  serverError?: string;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  mode,
  category,
  onSave,
  onCancel,
  loading,
  serverError,
}) => {
  const title = mode === "create" ? "Dodaj kategorię" : "Edytuj kategorię";
  const description =
    mode === "create"
      ? "Wypełnij formularz aby dodać nową kategorię wydatków."
      : "Zmodyfikuj nazwę kategorii i zapisz zmiany.";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  // Reset formularza gdy modal się otwiera/zamykają
  React.useEffect(() => {
    if (isOpen) {
      reset({
        name: category?.name || "",
      });
    }
  }, [isOpen, category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await onSave({ name: data.name.trim() });
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
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nazwa kategorii *
            </Label>
            <Input
              {...register("name")}
              type="text"
              id="name"
              placeholder="np. Jedzenie, Transport, Rozrywka"
              disabled={loading || isSubmitting}
              maxLength={100}
              className={errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
          </div>

          {serverError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{serverError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" onClick={handleCancel} disabled={loading || isSubmitting} variant="outline">
              Anuluj
            </Button>
            <Button type="submit" disabled={loading || isSubmitting}>
              {loading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Zapisywanie...
                </>
              ) : mode === "create" ? (
                "Dodaj kategorię"
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
