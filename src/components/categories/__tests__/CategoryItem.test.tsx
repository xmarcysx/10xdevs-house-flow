import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryItem } from "../CategoryItem";

// Mock Badge component
vi.mock("../../ui/badge", () => ({
  Badge: vi.fn(({ children, variant }) => (
    <span data-testid={`badge-${variant}`} className={`badge-${variant}`}>
      {children}
    </span>
  )),
}));

import { Badge } from "../../ui/badge";

const mockBadge = vi.mocked(Badge);

describe("CategoryItem", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const defaultCategory = {
    id: "1",
    name: "Jedzenie",
    is_default: false,
    created_at: "2023-01-15T10:30:00Z",
  };

  const defaultProps = {
    category: defaultCategory,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Rendering", () => {
    it("powinien renderować nazwę kategorii", () => {
      render(<CategoryItem {...defaultProps} />);

      expect(screen.getByText("Jedzenie")).toBeInTheDocument();
    });

    it("powinien renderować badge dla kategorii domyślnej", () => {
      const defaultCategoryProps = {
        ...defaultProps,
        category: { ...defaultCategory, is_default: true },
      };

      render(<CategoryItem {...defaultCategoryProps} />);

      expect(mockBadge).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "secondary",
          children: "Domyślna",
        }),
        undefined
      );
    });

    it("powinien renderować badge dla kategorii własnej", () => {
      render(<CategoryItem {...defaultProps} />);

      expect(mockBadge).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "default",
          children: "Własna",
        }),
        undefined
      );
    });

    it("powinien renderować przyciski edycji i usunięcia", () => {
      render(<CategoryItem {...defaultProps} />);

      expect(screen.getByTitle("Edytuj kategorię")).toBeInTheDocument();
      expect(screen.getByTitle("Usuń kategorię")).toBeInTheDocument();
    });
  });

  describe("Przycisk edycji", () => {
    it("powinien wywołać onEdit z kategorią po kliknięciu przycisku edycji", async () => {
      render(<CategoryItem {...defaultProps} />);

      const editButton = screen.getByTitle("Edytuj kategorię");
      await userEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(defaultCategory);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it("powinien mieć prawidłowy tytuł dla kategorii domyślnej", () => {
      const defaultCategoryProps = {
        ...defaultProps,
        category: { ...defaultCategory, is_default: true },
      };

      render(<CategoryItem {...defaultCategoryProps} />);

      const editButton = screen.getByTitle("Kategorie domyślne można tylko edytować");
      expect(editButton).toHaveAttribute("title", "Kategorie domyślne można tylko edytować");
    });

    it("powinien mieć prawidłowy tytuł dla kategorii własnej", () => {
      render(<CategoryItem {...defaultProps} />);

      const editButton = screen.getByTitle("Edytuj kategorię");
      expect(editButton).toHaveAttribute("title", "Edytuj kategorię");
    });
  });

  describe("Przycisk usunięcia", () => {
    it("powinien wywołać onDelete z ID kategorii po kliknięciu przycisku usunięcia", async () => {
      render(<CategoryItem {...defaultProps} />);

      const deleteButton = screen.getByTitle("Usuń kategorię");
      await userEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith("1");
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it("powinien być włączony dla kategorii własnej", () => {
      render(<CategoryItem {...defaultProps} />);

      const deleteButton = screen.getByTitle("Usuń kategorię");
      expect(deleteButton).not.toBeDisabled();
    });

    it("powinien być wyłączony dla kategorii domyślnej", () => {
      const defaultCategoryProps = {
        ...defaultProps,
        category: { ...defaultCategory, is_default: true },
      };

      render(<CategoryItem {...defaultCategoryProps} />);

      const deleteButton = screen.getByTitle("Nie można usunąć domyślnej kategorii");
      expect(deleteButton).toBeDisabled();
    });

    it("powinien mieć prawidłowy tytuł dla kategorii domyślnej", () => {
      const defaultCategoryProps = {
        ...defaultProps,
        category: { ...defaultCategory, is_default: true },
      };

      render(<CategoryItem {...defaultCategoryProps} />);

      const deleteButton = screen.getByTitle("Nie można usunąć domyślnej kategorii");
      expect(deleteButton).toHaveAttribute("title", "Nie można usunąć domyślnej kategorii");
    });

    it("powinien mieć prawidłowy tytuł dla kategorii własnej", () => {
      render(<CategoryItem {...defaultProps} />);

      const deleteButton = screen.getByTitle("Usuń kategorię");
      expect(deleteButton).toHaveAttribute("title", "Usuń kategorię");
    });
  });


  describe("Stylowanie", () => {
    it("powinien mieć odpowiednie klasy CSS dla wiersza tabeli", () => {
      const { container } = render(<CategoryItem {...defaultProps} />);

      const row = container.querySelector("tr");
      expect(row).toHaveClass("hover:bg-gradient-to-r");
      expect(row).toHaveClass("hover:from-blue-50/30");
      expect(row).toHaveClass("hover:to-indigo-50/30");
      expect(row).toHaveClass("dark:hover:from-blue-900/20");
      expect(row).toHaveClass("dark:hover:to-indigo-900/20");
      expect(row).toHaveClass("transition-all");
      expect(row).toHaveClass("duration-200");
    });

    it("powinien mieć odpowiednie klasy CSS dla komórek", () => {
      const { container } = render(<CategoryItem {...defaultProps} />);

      const cells = container.querySelectorAll("td");
      expect(cells[0]).toHaveClass("px-6", "py-4", "whitespace-nowrap", "text-sm", "font-medium", "text-gray-900", "dark:text-white");
      expect(cells[1]).toHaveClass("px-6", "py-4", "whitespace-nowrap", "text-sm", "text-gray-500", "dark:text-gray-400");
      expect(cells[2]).toHaveClass("px-6", "py-4", "whitespace-nowrap", "text-right", "text-sm", "font-medium");
    });

    it("powinien mieć odpowiednie klasy CSS dla przycisków", () => {
      render(<CategoryItem {...defaultProps} />);

      const editButton = screen.getByTitle("Edytuj kategorię");
      const deleteButton = screen.getByTitle("Usuń kategorię");

      expect(editButton).toHaveClass("text-blue-600", "hover:text-blue-900", "dark:text-blue-400", "dark:hover:text-blue-300");
      expect(deleteButton).toHaveClass("text-red-600", "hover:text-red-900", "dark:text-red-400", "dark:hover:text-red-300");
    });
  });

  describe("Dostępność", () => {
    it("powinien mieć atrybuty aria-disabled dla wyłączonych przycisków", () => {
      const defaultCategoryProps = {
        ...defaultProps,
        category: { ...defaultCategory, is_default: true },
      };

      render(<CategoryItem {...defaultCategoryProps} />);

      const deleteButton = screen.getByTitle("Nie można usunąć domyślnej kategorii");
      expect(deleteButton).toHaveAttribute("disabled");
      expect(deleteButton).toHaveClass("disabled:opacity-50", "disabled:cursor-not-allowed");
    });

    it("powinien mieć tytuły dla przycisków", () => {
      render(<CategoryItem {...defaultProps} />);

      const editButton = screen.getByTitle("Edytuj kategorię");
      const deleteButton = screen.getByTitle("Usuń kategorię");

      expect(editButton).toHaveAttribute("title");
      expect(deleteButton).toHaveAttribute("title");
    });

    it("powinien mieć odpowiednie role dla przycisków", () => {
      render(<CategoryItem {...defaultProps} />);

      const editButton = screen.getByTitle("Edytuj kategorię");
      const deleteButton = screen.getByTitle("Usuń kategorię");

      expect(editButton).toHaveAttribute("type", "button");
      expect(deleteButton).toHaveAttribute("type", "button");
    });
  });

  describe("Interakcje", () => {
    it("powinien wywoływać callbacki tylko po kliknięciu odpowiednich przycisków", async () => {
      render(<CategoryItem {...defaultProps} />);

      const editButton = screen.getByTitle("Edytuj kategorię");
      const deleteButton = screen.getByTitle("Usuń kategorię");

      await userEvent.click(editButton);
      expect(mockOnEdit).toHaveBeenCalledWith(defaultCategory);
      expect(mockOnDelete).not.toHaveBeenCalled();

      await userEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
      expect(mockOnEdit).toHaveBeenCalledTimes(1); // nadal tylko jedno wywołanie
    });

    it("powinien obsługiwać wielokrotne kliknięcia", async () => {
      render(<CategoryItem {...defaultProps} />);

      const editButton = screen.getByTitle("Edytuj kategorię");

      await userEvent.click(editButton);
      await userEvent.click(editButton);
      await userEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(3);
      expect(mockOnEdit).toHaveBeenCalledWith(defaultCategory);
    });
  });

  describe("Edge cases", () => {
    it("powinien obsługiwać kategorie bez nazwy", () => {
      const categoryWithoutName = {
        ...defaultCategory,
        name: "",
      };

      const { container } = render(<CategoryItem {...defaultProps} category={categoryWithoutName} />);

      // Sprawdź czy nazwa kategorii jest pusta w DOM
      const nameCell = container.querySelector("td");
      expect(nameCell?.textContent).toBe("");
    });

    it("powinien obsługiwać kategorie z długą nazwą", () => {
      const categoryWithLongName = {
        ...defaultCategory,
        name: "Bardzo długa nazwa kategorii która może być problemem z layoutem",
      };

      render(<CategoryItem {...defaultProps} category={categoryWithLongName} />);

      expect(screen.getByText("Bardzo długa nazwa kategorii która może być problemem z layoutem")).toBeInTheDocument();
    });

    it("powinien obsługiwać kategorie z specjalnymi znakami w nazwie", () => {
      const categoryWithSpecialChars = {
        ...defaultCategory,
        name: "Kategoria z znakami: áéíóú ñ & < > \" '",
      };

      render(<CategoryItem {...defaultProps} category={categoryWithSpecialChars} />);

      expect(screen.getByText("Kategoria z znakami: áéíóú ñ & < > \" '")).toBeInTheDocument();
    });
  });
});
