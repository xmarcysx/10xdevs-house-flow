import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoriesPage } from "../CategoriesPage";
import { toast } from "sonner";

// Mock dependencies
vi.mock("../../../lib/hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

vi.mock("../CategoriesList", () => ({
  CategoriesList: vi.fn(({ onAdd, onEdit, onDelete, onPageChange }) => (
    <div data-testid="categories-list">
      <button data-testid="add-category-btn" onClick={onAdd}>
        Dodaj kategorię
      </button>
      <button data-testid="edit-category-btn" onClick={() => onEdit({ id: "1", name: "Test Category", is_default: false, created_at: "2023-01-01" })}>
        Edytuj kategorię
      </button>
      <button data-testid="delete-category-btn" onClick={() => onDelete("1")}>
        Usuń kategorię
      </button>
      <button data-testid="page-change-btn" onClick={() => onPageChange(2)}>
        Zmień stronę
      </button>
    </div>
  )),
}));

vi.mock("../CategoryFormModal", () => ({
  CategoryFormModal: vi.fn(({ onSave, onCancel }) => (
    <div data-testid="category-form-modal">
      <button data-testid="save-form-btn" onClick={() => onSave({ name: "New Category" })}>
        Zapisz
      </button>
      <button data-testid="cancel-form-btn" onClick={onCancel}>
        Anuluj
      </button>
    </div>
  )),
}));

vi.mock("../CategoriesLayout", () => ({
  default: vi.fn(({ children }) => <div data-testid="categories-layout">{children}</div>),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useCategories } from "../../../lib/hooks/useCategories";
import { CategoriesList } from "../CategoriesList";
import { CategoryFormModal } from "../CategoryFormModal";
import CategoriesLayout from "../CategoriesLayout";

const mockUseCategories = vi.mocked(useCategories);
const mockCategoriesList = vi.mocked(CategoriesList);
const mockCategoryFormModal = vi.mocked(CategoryFormModal);
const mockCategoriesLayout = vi.mocked(CategoriesLayout);
const mockToastSuccess = vi.mocked(toast.success);
const mockToastError = vi.mocked(toast.error);

describe("CategoriesPage", () => {
  const mockCategories = [
    { id: "1", name: "Jedzenie", is_default: false, created_at: "2023-01-01" },
    { id: "2", name: "Transport", is_default: false, created_at: "2023-01-02" },
  ];

  const mockPagination = { page: 1, limit: 10, total: 20 };

  const defaultMockHookReturn = {
    categories: mockCategories,
    pagination: mockPagination,
    isLoading: false,
    isSubmitting: false,
    error: null,
    fetchCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    clearError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCategories.mockReturnValue(defaultMockHookReturn);
    mockCategoriesLayout.mockImplementation(({ children }) => (
      <div data-testid="categories-layout">{children}</div>
    ));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Rendering", () => {
    it("powinien renderować komponent z prawidłową strukturą", () => {
      render(<CategoriesPage />);

      expect(screen.getByTestId("categories-layout")).toBeInTheDocument();
      expect(screen.getByTestId("categories-list")).toBeInTheDocument();
      expect(mockCategoriesLayout).toHaveBeenCalled();
    });

    it("powinien wyświetlić komunikat błędu gdy występuje błąd", () => {
      const mockHookWithError = {
        ...defaultMockHookReturn,
        error: "Błąd pobierania danych",
      };
      mockUseCategories.mockReturnValue(mockHookWithError);

      render(<CategoriesPage />);

      expect(screen.getByText("Błąd pobierania danych")).toBeInTheDocument();
    });

    it("powinien ukryć komunikat błędu po kliknięciu przycisku zamknięcia", async () => {
      const mockClearError = vi.fn();
      const mockHookWithError = {
        ...defaultMockHookReturn,
        error: "Błąd pobierania danych",
        clearError: mockClearError,
      };
      mockUseCategories.mockReturnValue(mockHookWithError);

      render(<CategoriesPage />);

      const closeButton = screen.getByRole("button", { name: /zamknij/i });
      await userEvent.click(closeButton);

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe("Stan początkowy", () => {
    it("powinien wywołać fetchCategories przy montowaniu komponentu", () => {
      const mockFetchCategories = vi.fn();
      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        fetchCategories: mockFetchCategories,
      });

      render(<CategoriesPage />);

      expect(mockFetchCategories).toHaveBeenCalledWith(1, 10);
    });

    it("powinien wywołać fetchCategories przy zmianie strony", async () => {
      const mockFetchCategories = vi.fn();
      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        fetchCategories: mockFetchCategories,
      });

      render(<CategoriesPage />);

      const pageChangeBtn = screen.getByTestId("page-change-btn");
      await userEvent.click(pageChangeBtn);

      expect(mockFetchCategories).toHaveBeenCalledWith(2, 10);
    });
  });

  describe("Dodawanie kategorii", () => {
    it("powinien otworzyć modal w trybie tworzenia po kliknięciu 'Dodaj kategorię'", async () => {
      render(<CategoriesPage />);

      const addButton = screen.getByTestId("add-category-btn");
      await userEvent.click(addButton);

      expect(mockCategoryFormModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: true,
          mode: "create",
          category: undefined,
          serverError: undefined,
        }),
        undefined
      );
    });

    it("powinien utworzyć nową kategorię i wyświetlić toast sukcesu", async () => {
      const mockCreateCategory = vi.fn().mockResolvedValue({
        id: "3",
        name: "Nowa Kategoria",
        is_default: false,
        created_at: "2023-01-03",
      });
      const mockFetchCategories = vi.fn();

      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        createCategory: mockCreateCategory,
        fetchCategories: mockFetchCategories,
      });

      render(<CategoriesPage />);

      // Otwórz modal
      const addButton = screen.getByTestId("add-category-btn");
      await userEvent.click(addButton);

      // Zapisz formularz
      const saveButton = screen.getByTestId("save-form-btn");
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockCreateCategory).toHaveBeenCalledWith({ name: "New Category" });
        expect(mockToastSuccess).toHaveBeenCalledWith("Kategoria została dodana pomyślnie");
        expect(mockFetchCategories).toHaveBeenCalledWith(1, 10);
      });
    });

    it("powinien obsłużyć błąd podczas tworzenia kategorii", async () => {
      const mockCreateCategory = vi.fn().mockRejectedValue(new Error("Duplikat nazwy"));
      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        createCategory: mockCreateCategory,
      });

      render(<CategoriesPage />);

      // Otwórz modal
      const addButton = screen.getByTestId("add-category-btn");
      await userEvent.click(addButton);

      // Zapisz formularz
      const saveButton = screen.getByTestId("save-form-btn");
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockCategoryFormModal).toHaveBeenLastCalledWith(
          expect.objectContaining({
            serverError: "Duplikat nazwy",
          }),
          undefined
        );
      });
    });

    it("powinien obsłużyć błąd 'już istnieje' z niestandardowym komunikatem", async () => {
      const mockCreateCategory = vi.fn().mockRejectedValue(new Error("Kategoria już istnieje"));
      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        createCategory: mockCreateCategory,
      });

      render(<CategoriesPage />);

      const addButton = screen.getByTestId("add-category-btn");
      await userEvent.click(addButton);

      const saveButton = screen.getByTestId("save-form-btn");
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockCategoryFormModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          serverError: "Kategoria o tej nazwie już istnieje",
        }),
        undefined
        );
      });
    });
  });

  describe("Edycja kategorii", () => {
    it("powinien otworzyć modal w trybie edycji z wybranymi danymi kategorii", async () => {
      render(<CategoriesPage />);

      const editButton = screen.getByTestId("edit-category-btn");
      await userEvent.click(editButton);

      expect(mockCategoryFormModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: true,
          mode: "edit",
          category: { id: "1", name: "Test Category", is_default: false, created_at: "2023-01-01" },
          serverError: undefined,
        }),
        undefined
      );
    });

    it("powinien zaktualizować kategorię i wyświetlić toast sukcesu", async () => {
      const mockUpdateCategory = vi.fn().mockResolvedValue({
        id: "1",
        name: "Zaktualizowana Kategoria",
        is_default: false,
        created_at: "2023-01-01",
      });
      const mockFetchCategories = vi.fn();

      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        updateCategory: mockUpdateCategory,
        fetchCategories: mockFetchCategories,
      });

      render(<CategoriesPage />);

      // Otwórz modal edycji
      const editButton = screen.getByTestId("edit-category-btn");
      await userEvent.click(editButton);

      // Zapisz formularz
      const saveButton = screen.getByTestId("save-form-btn");
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateCategory).toHaveBeenCalledWith("1", { name: "New Category" });
        expect(mockToastSuccess).toHaveBeenCalledWith("Kategoria została zaktualizowana pomyślnie");
        expect(mockFetchCategories).toHaveBeenCalledWith(1, 10);
      });
    });

    it("powinien obsłużyć błąd podczas aktualizacji kategorii", async () => {
      const mockUpdateCategory = vi.fn().mockRejectedValue(new Error("Błąd aktualizacji"));
      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        updateCategory: mockUpdateCategory,
      });

      render(<CategoriesPage />);

      const editButton = screen.getByTestId("edit-category-btn");
      await userEvent.click(editButton);

      const saveButton = screen.getByTestId("save-form-btn");
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockCategoryFormModal).toHaveBeenLastCalledWith(
          expect.objectContaining({
            serverError: "Błąd aktualizacji",
          }),
          undefined
        );
      });
    });
  });

  describe("Usuwanie kategorii", () => {
    it("powinien usunąć kategorię i wyświetlić toast sukcesu", async () => {
      const mockDeleteCategory = vi.fn().mockResolvedValue(undefined);
      const mockFetchCategories = vi.fn();

      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        deleteCategory: mockDeleteCategory,
        fetchCategories: mockFetchCategories,
      });

      render(<CategoriesPage />);

      const deleteButton = screen.getByTestId("delete-category-btn");
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteCategory).toHaveBeenCalledWith("1");
        expect(mockToastSuccess).toHaveBeenCalledWith("Kategoria została usunięta pomyślnie");
        expect(mockFetchCategories).toHaveBeenCalledWith(1, 10);
      });
    });

    it("powinien zresetować stronę gdy po usunięciu zostaje tylko jeden element na stronie", async () => {
      const mockDeleteCategory = vi.fn().mockResolvedValue(undefined);
      const mockFetchCategories = vi.fn();
      const categoriesWithOneItem = [mockCategories[0]]; // Tylko jeden element

      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        categories: categoriesWithOneItem,
        deleteCategory: mockDeleteCategory,
        fetchCategories: mockFetchCategories,
      });

      render(<CategoriesPage />);

      const deleteButton = screen.getByTestId("delete-category-btn");
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockFetchCategories).toHaveBeenCalledWith(1, 10);
      });
    });

    it("powinien obsłużyć błąd podczas usuwania kategorii", async () => {
      const mockDeleteCategory = vi.fn().mockRejectedValue(new Error("Błąd usuwania"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        deleteCategory: mockDeleteCategory,
      });

      render(<CategoriesPage />);

      const deleteButton = screen.getByTestId("delete-category-btn");
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("Delete error:", expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Zamykanie modala", () => {
    it("powinien zamknąć modal po kliknięciu anuluj", async () => {
      render(<CategoriesPage />);

      // Otwórz modal
      const addButton = screen.getByTestId("add-category-btn");
      await userEvent.click(addButton);

      // Zamknij modal
      const cancelButton = screen.getByTestId("cancel-form-btn");
      await userEvent.click(cancelButton);

      expect(mockCategoryFormModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          mode: "create",
          serverError: undefined,
        }),
        undefined
      );
    });

    it("powinien zamknąć modal po pomyślnym zapisaniu", async () => {
      const mockCreateCategory = vi.fn().mockResolvedValue({
        id: "3",
        name: "Nowa Kategoria",
        is_default: false,
        created_at: "2023-01-03",
      });
      const mockFetchCategories = vi.fn();

      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        createCategory: mockCreateCategory,
        fetchCategories: mockFetchCategories,
      });

      render(<CategoriesPage />);

      // Otwórz modal
      const addButton = screen.getByTestId("add-category-btn");
      await userEvent.click(addButton);

      // Zapisz formularz
      const saveButton = screen.getByTestId("save-form-btn");
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockCategoryFormModal).toHaveBeenLastCalledWith(
          expect.objectContaining({
            isOpen: false,
            mode: "create",
            serverError: undefined,
          }),
          undefined
        );
      });
    });
  });

  describe("Paginacja", () => {
    it("powinien zmienić stronę po kliknięciu przycisku zmiany strony", async () => {
      const mockFetchCategories = vi.fn();
      mockUseCategories.mockReturnValue({
        ...defaultMockHookReturn,
        fetchCategories: mockFetchCategories,
      });

      render(<CategoriesPage />);

      const pageChangeBtn = screen.getByTestId("page-change-btn");
      await userEvent.click(pageChangeBtn);

      expect(mockFetchCategories).toHaveBeenCalledWith(2, 10);
    });
  });

  describe("Stan ładowania", () => {
    it("powinien przekazać stan ładowania do komponentów potomnych", () => {
      const mockHookWithLoading = {
        ...defaultMockHookReturn,
        isLoading: true,
        isSubmitting: true,
      };
      mockUseCategories.mockReturnValue(mockHookWithLoading);

      render(<CategoriesPage />);

      expect(mockCategoriesList).toHaveBeenCalledWith(
        expect.objectContaining({
          loading: true,
        }),
        undefined
      );

      expect(mockCategoryFormModal).toHaveBeenCalledWith(
        expect.objectContaining({
          loading: true,
        }),
        undefined
      );
    });
  });
});
