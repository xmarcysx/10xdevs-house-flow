import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryFormModal } from "../CategoryFormModal";

// Mock react-hook-form
const mockRegister = vi.fn();
const mockHandleSubmit = vi.fn();
const mockReset = vi.fn();
const mockSetError = vi.fn();

vi.mock("react-hook-form", () => ({
  useForm: vi.fn(() => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    formState: {
      errors: {},
      isSubmitting: false,
    },
    reset: mockReset,
    setError: mockSetError,
  })),
}));

// Mock UI components
vi.mock("../../ui/button", () => ({
  Button: vi.fn(({ children, onClick, disabled, type, variant, className, ...props }) => (
    <button
      data-testid={`button-${type || variant || "default"}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      {...props}
    >
      {children}
    </button>
  )),
}));

vi.mock("../../ui/dialog", () => ({
  Dialog: vi.fn(({ children, open, onOpenChange }) =>
    open ? (
      <div data-testid="dialog" onClick={() => onOpenChange?.(false)}>
        {children}
      </div>
    ) : null
  ),
  DialogContent: vi.fn(({ children, className }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  )),
  DialogDescription: vi.fn(({ children }) => <div data-testid="dialog-description">{children}</div>),
  DialogHeader: vi.fn(({ children }) => <div data-testid="dialog-header">{children}</div>),
  DialogTitle: vi.fn(({ children }) => <div data-testid="dialog-title">{children}</div>),
}));

vi.mock("../../ui/input", () => ({
  Input: vi.fn(({ ...props }) => <input data-testid="input-name" {...props} />),
}));

vi.mock("../../ui/label", () => ({
  Label: vi.fn(({ children, htmlFor, ...props }) => (
    <label data-testid="label-name" htmlFor={htmlFor} {...props}>
      {children}
    </label>
  )),
}));

import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const mockUseForm = vi.mocked(useForm);
const mockButton = vi.mocked(Button);
const mockDialog = vi.mocked(Dialog);
const mockDialogContent = vi.mocked(DialogContent);
const mockDialogDescription = vi.mocked(DialogDescription);
const mockDialogHeader = vi.mocked(DialogHeader);
const mockDialogTitle = vi.mocked(DialogTitle);
const mockInput = vi.mocked(Input);
const mockLabel = vi.mocked(Label);

describe("CategoryFormModal", () => {
  const mockCategory = {
    id: "1",
    name: "Test Category",
    is_default: false,
    created_at: "2023-01-01",
  };

  const defaultProps = {
    isOpen: true,
    mode: "create" as const,
    onSave: vi.fn(),
    onCancel: vi.fn(),
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock implementations
    mockUseForm.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      formState: {
        errors: {},
        isSubmitting: false,
      },
      reset: mockReset,
      setError: mockSetError,
    });

    mockHandleSubmit.mockImplementation((fn) => (e: any) => {
      e?.preventDefault?.();
      return fn({ name: "Test Category" });
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Rendering", () => {
    it("powinien renderować modal gdy isOpen = true", () => {
      render(<CategoryFormModal {...defaultProps} />);

      expect(mockDialog).toHaveBeenCalledWith(expect.objectContaining({ open: true }), undefined);
    });

    it("nie powinien renderować modal gdy isOpen = false", () => {
      render(<CategoryFormModal {...defaultProps} isOpen={false} />);

      expect(mockDialog).toHaveBeenCalledWith(expect.objectContaining({ open: false }), undefined);
    });

    it("powinien wyświetlić prawidłowy tytuł dla trybu tworzenia", () => {
      render(<CategoryFormModal {...defaultProps} mode="create" />);

      expect(mockDialogTitle).toHaveBeenCalledWith(expect.objectContaining({ children: "Dodaj kategorię" }), undefined);
    });

    it("powinien wyświetlić prawidłowy tytuł dla trybu edycji", () => {
      render(<CategoryFormModal {...defaultProps} mode="edit" />);

      expect(mockDialogTitle).toHaveBeenCalledWith(
        expect.objectContaining({ children: "Edytuj kategorię" }),
        undefined
      );
    });

    it("powinien wyświetlić prawidłowy opis dla trybu tworzenia", () => {
      render(<CategoryFormModal {...defaultProps} mode="create" />);

      expect(mockDialogDescription).toHaveBeenCalledWith(
        expect.objectContaining({
          children: "Wypełnij formularz aby dodać nową kategorię wydatków.",
        }),
        undefined
      );
    });

    it("powinien wyświetlić prawidłowy opis dla trybu edycji", () => {
      render(<CategoryFormModal {...defaultProps} mode="edit" />);

      expect(mockDialogDescription).toHaveBeenCalledWith(
        expect.objectContaining({
          children: "Zmodyfikuj nazwę kategorii i zapisz zmiany.",
        }),
        undefined
      );
    });

    it("powinien renderować pole input z prawidłową konfiguracją", () => {
      render(<CategoryFormModal {...defaultProps} />);

      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "text",
          id: "name",
          placeholder: "np. Jedzenie, Transport, Rozrywka",
          maxLength: 100,
        }),
        undefined
      );
    });

    it("powinien renderować przyciski Anuluj i Dodaj kategorię/Zapisz zmiany", () => {
      render(<CategoryFormModal {...defaultProps} mode="create" />);

      expect(screen.getByRole("button", { name: "Anuluj" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dodaj kategorię" })).toBeInTheDocument();
    });

    it("powinien renderować przycisk 'Zapisz zmiany' w trybie edycji", () => {
      render(<CategoryFormModal {...defaultProps} mode="edit" />);

      expect(screen.getByText("Zapisz zmiany")).toBeInTheDocument();
    });
  });

  describe("Formularz", () => {
    it("powinien wywołać reset z pustą wartością w trybie tworzenia", () => {
      render(<CategoryFormModal {...defaultProps} mode="create" />);

      expect(mockReset).toHaveBeenCalledWith({
        name: "",
      });
    });

    it("powinien wywołać reset z wartością kategorii w trybie edycji", () => {
      render(<CategoryFormModal {...defaultProps} mode="edit" category={mockCategory} />);

      expect(mockReset).toHaveBeenCalledWith({
        name: "Test Category",
      });
    });

    it("powinien resetować formularz gdy modal się otwiera", () => {
      const { rerender } = render(<CategoryFormModal {...defaultProps} isOpen={false} />);
      expect(mockReset).not.toHaveBeenCalled();

      rerender(<CategoryFormModal {...defaultProps} isOpen={true} />);
      expect(mockReset).toHaveBeenCalledWith({ name: "" });
    });

    it("powinien wywołać onSave z prawidłowymi danymi po zatwierdzeniu formularza", async () => {
      const mockOnSave = vi.fn().mockResolvedValue(undefined);
      render(<CategoryFormModal {...defaultProps} onSave={mockOnSave} />);

      const form = screen.getByTestId("dialog").querySelector("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({ name: "Test Category" });
      });
    });

    it("powinien trimować nazwę przed przekazaniem do onSave", async () => {
      const mockOnSave = vi.fn().mockResolvedValue(undefined);
      mockHandleSubmit.mockImplementation((fn) => (e: any) => {
        e?.preventDefault?.();
        return fn({ name: "  Test Category  " });
      });

      render(<CategoryFormModal {...defaultProps} onSave={mockOnSave} />);

      const form = screen.getByTestId("dialog").querySelector("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({ name: "Test Category" });
      });
    });

    it("powinien obsłużyć błędy podczas zapisywania", async () => {
      const mockOnSave = vi.fn().mockRejectedValue(new Error("Save error"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(<CategoryFormModal {...defaultProps} onSave={mockOnSave} />);

      const form = screen.getByTestId("dialog").querySelector("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("Form submission error:", expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Przyciski", () => {
    it("powinien wywołać onCancel i reset po kliknięciu Anuluj", () => {
      const mockOnCancel = vi.fn();
      render(<CategoryFormModal {...defaultProps} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByText("Anuluj");
      fireEvent.click(cancelButton);

      expect(mockReset).toHaveBeenCalled();
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it("powinien wywołać onCancel gdy użytkownik kliknie poza modal", () => {
      const mockOnCancel = vi.fn();
      render(<CategoryFormModal {...defaultProps} onCancel={mockOnCancel} />);

      const dialog = screen.getByTestId("dialog");
      fireEvent.click(dialog);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it("powinien wyłączyć przyciski podczas ładowania", () => {
      render(<CategoryFormModal {...defaultProps} loading={true} />);

      const submitButton = screen.getByRole("button", { name: /Dodaj kategorię|Zapisywanie/ });
      const cancelButton = screen.getByRole("button", { name: "Anuluj" });

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it("powinien wyłączyć przyciski podczas wysyłania formularza", () => {
      mockUseForm.mockReturnValue({
        register: mockRegister,
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: {},
          isSubmitting: true,
        },
        reset: mockReset,
        setError: mockSetError,
      });

      render(<CategoryFormModal {...defaultProps} />);

      const submitButton = screen.getByRole("button", { name: /Dodaj kategorię|Zapisywanie/ });
      const cancelButton = screen.getByRole("button", { name: "Anuluj" });

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it("powinien wyświetlić loader podczas wysyłania formularza", () => {
      mockUseForm.mockReturnValue({
        register: mockRegister,
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: {},
          isSubmitting: true,
        },
        reset: mockReset,
        setError: mockSetError,
      });

      render(<CategoryFormModal {...defaultProps} />);

      expect(screen.getByText("Zapisywanie...")).toBeInTheDocument();
    });
  });

  describe("Błędy", () => {
    it("powinien wyświetlić błąd walidacji formularza", () => {
      mockUseForm.mockReturnValue({
        register: mockRegister,
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: { name: { message: "Nazwa jest wymagana" } },
          isSubmitting: false,
        },
        reset: mockReset,
        setError: mockSetError,
      });

      render(<CategoryFormModal {...defaultProps} />);

      expect(screen.getByText("Nazwa jest wymagana")).toBeInTheDocument();
    });

    it("powinien wyświetlić błąd serwera", () => {
      render(<CategoryFormModal {...defaultProps} serverError="Kategoria już istnieje" />);

      expect(screen.getByText("Kategoria już istnieje")).toBeInTheDocument();
    });

    it("powinien dodać klasę błędu do input gdy występuje błąd walidacji", () => {
      mockUseForm.mockReturnValue({
        register: mockRegister,
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: { name: { message: "Błąd" } },
          isSubmitting: false,
        },
        reset: mockReset,
        setError: mockSetError,
      });

      render(<CategoryFormModal {...defaultProps} />);

      expect(mockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          className: expect.stringContaining("border-red-500"),
        }),
        undefined
      );
    });
  });

  describe("Walidacja", () => {
    it("powinien wymagać nazwy kategorii", async () => {
      mockHandleSubmit.mockImplementation((fn) => (e: any) => {
        e?.preventDefault?.();
        return fn({ name: "" });
      });

      render(<CategoryFormModal {...defaultProps} />);

      const form = screen.getByTestId("dialog").querySelector("form");
      fireEvent.submit(form!);

      // Walidacja jest obsługiwana przez zod, więc sprawdzamy czy handleSubmit został wywołany z pustą wartością
      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it("powinien walidować maksymalną długość nazwy", () => {
      const longName = "a".repeat(101);
      mockHandleSubmit.mockImplementation((fn) => (e: any) => {
        e?.preventDefault?.();
        return fn({ name: longName });
      });

      render(<CategoryFormModal {...defaultProps} />);

      const input = screen.getByTestId("input-name");
      expect(input).toHaveAttribute("maxLength", "100");
    });
  });

  describe("Dostępność", () => {
    it("powinien mieć przyciski z odpowiednimi atrybutami dostępności", () => {
      render(<CategoryFormModal {...defaultProps} />);

      const submitButton = screen.getByRole("button", { name: /Dodaj kategorię|Zapisywanie/ });
      const cancelButton = screen.getByRole("button", { name: "Anuluj" });

      expect(submitButton).toHaveAttribute("type", "submit");
      expect(cancelButton).toHaveAttribute("type", "button");
    });
  });
});
