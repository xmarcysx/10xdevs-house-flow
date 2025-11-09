import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoriesList } from "../CategoriesList";

// Mock dependencies
vi.mock("../../incomes/Pagination", () => ({
  Pagination: vi.fn(({ onPageChange }) => (
    <div data-testid="pagination-component">
      <button data-testid="pagination-page-btn" onClick={() => onPageChange(2)}>
        Strona 2
      </button>
    </div>
  )),
}));

vi.mock("../../ui/button", () => ({
  Button: vi.fn(({ children, onClick, disabled, variant, className, ...props }) => (
    <button
      data-testid={`button-${variant || "default"}`}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  )),
}));

vi.mock("../../ui/table", () => ({
  Table: vi.fn(({ children }) => <table data-testid="table">{children}</table>),
  TableBody: vi.fn(({ children }) => <tbody>{children}</tbody>),
  TableHead: vi.fn(({ children }) => <th>{children}</th>),
  TableHeader: vi.fn(({ children }) => <thead>{children}</thead>),
  TableRow: vi.fn(({ children }) => <tr>{children}</tr>),
}));

vi.mock("../CategoryItem", () => ({
  CategoryItem: vi.fn(({ category, onEdit, onDelete }) => (
    <tr data-testid={`category-item-${category.id}`}>
      <td>{category.name}</td>
      <button data-testid={`edit-${category.id}`} onClick={() => onEdit(category)}>
        Edytuj
      </button>
      <button data-testid={`delete-${category.id}`} onClick={() => onDelete(category.id)}>
        Usuń
      </button>
    </tr>
  )),
}));

vi.mock("../../LoadingComponent", () => ({
  default: vi.fn(({ message }) => <div data-testid="loading-component">{message}</div>),
}));

import { Pagination } from "../../incomes/Pagination";
import { Button } from "../../ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../ui/table";
import { CategoryItem } from "../CategoryItem";
import LoadingComponent from "../../LoadingComponent";

const mockPagination = vi.mocked(Pagination);
const mockButton = vi.mocked(Button);
const mockTable = vi.mocked(Table);
const mockTableBody = vi.mocked(TableBody);
const mockTableHead = vi.mocked(TableHead);
const mockTableHeader = vi.mocked(TableHeader);
const mockTableRow = vi.mocked(TableRow);
const mockCategoryItem = vi.mocked(CategoryItem);
const mockLoadingComponent = vi.mocked(LoadingComponent);

describe("CategoriesList", () => {
  const mockCategories = [
    { id: "1", name: "Jedzenie", is_default: false, created_at: "2023-01-01" },
    { id: "2", name: "Transport", is_default: true, created_at: "2023-01-02" },
  ];

  const mockPaginationData = { page: 1, limit: 10, total: 25 };

  const defaultProps = {
    categories: mockCategories,
    pagination: mockPaginationData,
    loading: false,
    onAdd: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementations to default
    mockButton.mockImplementation(({ children, onClick, disabled, variant, className, ...props }) => (
      <button
        data-testid={`button-${variant || "default"}`}
        onClick={onClick}
        disabled={disabled}
        className={className}
        {...props}
      >
        {children}
      </button>
    ));
  });

  describe("Stan ładowania", () => {
    it("powinien wyświetlić komponent ładowania gdy loading = true", () => {
      render(<CategoriesList {...defaultProps} loading={true} />);

      expect(mockLoadingComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Ładowanie kategorii...",
          size: "sm",
        }),
        undefined
      );
    });
  });

  describe("Brak danych", () => {
    it("powinien wyświetlić stan pusty gdy nie ma kategorii", () => {
      render(<CategoriesList {...defaultProps} categories={[]} />);

      expect(screen.getByText("Brak kategorii")).toBeInTheDocument();
      expect(screen.getByText("Nie znaleziono żadnych kategorii.")).toBeInTheDocument();
      expect(screen.getByText("Dodaj pierwszą kategorię")).toBeInTheDocument();
    });

    it("powinien wyświetlić stan pusty gdy categories = null", () => {
      render(<CategoriesList {...defaultProps} categories={null as any} />);

      expect(screen.getByText("Brak kategorii")).toBeInTheDocument();
    });

    it("powinien wywołać onAdd po kliknięciu 'Dodaj pierwszą kategorię'", async () => {
      const mockOnAdd = vi.fn();
      render(<CategoriesList {...defaultProps} categories={[]} onAdd={mockOnAdd} />);

      const addButton = screen.getByText("Dodaj pierwszą kategorię");
      await userEvent.click(addButton);

      expect(mockOnAdd).toHaveBeenCalled();
    });
  });

  describe("Lista kategorii", () => {
    it("powinien wyświetlić tytuł i opis sekcji", () => {
      render(<CategoriesList {...defaultProps} />);

      expect(screen.getByText("Lista kategorii")).toBeInTheDocument();
      expect(screen.getByText("Zarządzaj swoimi kategoriami wydatków")).toBeInTheDocument();
    });

    it("powinien wyświetlić przycisk 'Dodaj kategorię'", () => {
      render(<CategoriesList {...defaultProps} />);

      const addButton = screen.getByText("Dodaj kategorię");
      expect(addButton).toBeInTheDocument();
    });

    it("powinien wywołać onAdd po kliknięciu przycisku 'Dodaj kategorię'", async () => {
      const mockOnAdd = vi.fn();
      render(<CategoriesList {...defaultProps} onAdd={mockOnAdd} />);

      const addButton = screen.getByText("Dodaj kategorię");
      await userEvent.click(addButton);

      expect(mockOnAdd).toHaveBeenCalled();
    });

    it("powinien wyświetlić tabelę z nagłówkami", () => {
      render(<CategoriesList {...defaultProps} />);

      expect(mockTable).toHaveBeenCalled();
      expect(mockTableHeader).toHaveBeenCalled();
      expect(screen.getByText("Nazwa kategorii")).toBeInTheDocument();
      expect(screen.getByText("Typ")).toBeInTheDocument();
      expect(screen.getByText("Akcje")).toBeInTheDocument();
    });

    it("powinien renderować CategoryItem dla każdej kategorii", () => {
      render(<CategoriesList {...defaultProps} />);

      expect(mockCategoryItem).toHaveBeenCalledTimes(2);
      expect(mockCategoryItem).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          category: mockCategories[0],
        }),
        undefined
      );
      expect(mockCategoryItem).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          category: mockCategories[1],
        }),
        undefined
      );
    });

    it("powinien przekazać prawidłowe callbacki do CategoryItem", () => {
      const mockOnEdit = vi.fn();
      const mockOnDelete = vi.fn();

      render(<CategoriesList {...defaultProps} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      // Symuluj kliknięcie w przyciski edycji i usunięcia (mockowane w CategoryItem)
      const editButton = screen.getByTestId("edit-1");
      const deleteButton = screen.getByTestId("delete-1");

      fireEvent.click(editButton);
      fireEvent.click(deleteButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockCategories[0]);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });
  });

  describe("Paginacja", () => {
    it("powinien wyświetlić paginację gdy total > limit", () => {
      render(<CategoriesList {...defaultProps} />);

      expect(mockPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: mockPaginationData,
        }),
        undefined
      );
    });

    it("nie powinien wyświetlić paginacji gdy total <= limit", () => {
      const smallPagination = { page: 1, limit: 10, total: 5 };
      render(<CategoriesList {...defaultProps} pagination={smallPagination} />);

      expect(mockPagination).not.toHaveBeenCalled();
    });

    it("powinien wywołać onPageChange po zmianie strony", () => {
      const mockOnPageChange = vi.fn();
      render(<CategoriesList {...defaultProps} onPageChange={mockOnPageChange} />);

      const pageButton = screen.getByTestId("pagination-page-btn");
      fireEvent.click(pageButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });


    describe("Przyciski paginacji mobilnej", () => {
      it("powinien wyświetlić przyciski poprzednia/następna na mobile", () => {
        render(<CategoriesList {...defaultProps} />);

        expect(screen.getByText("Poprzednia")).toBeInTheDocument();
        expect(screen.getByText("Następna")).toBeInTheDocument();
      });

      it("powinien wyłączyć przycisk 'Poprzednia' na pierwszej stronie", () => {
        render(<CategoriesList {...defaultProps} />);

        const prevButton = screen.getByText("Poprzednia");
        expect(prevButton).toBeDisabled();
      });

      it("powinien włączyć przycisk 'Następna' gdy nie jest ostatnią stroną", () => {
        render(<CategoriesList {...defaultProps} />);

        const nextButton = screen.getByText("Następna");
        expect(nextButton).not.toBeDisabled();
      });

      it("powinien wyłączyć przycisk 'Następna' na ostatniej stronie", () => {
        const lastPagePagination = { page: 3, limit: 10, total: 25 };
        render(<CategoriesList {...defaultProps} pagination={lastPagePagination} />);

        const nextButton = screen.getByText("Następna");
        expect(nextButton).toBeDisabled();
      });

      it("powinien wywołać onPageChange z poprzednią stroną", () => {
        const mockOnPageChange = vi.fn();
        const secondPagePagination = { page: 2, limit: 10, total: 25 };
        render(<CategoriesList {...defaultProps} pagination={secondPagePagination} onPageChange={mockOnPageChange} />);

        const prevButton = screen.getByText("Poprzednia");
        fireEvent.click(prevButton);

        expect(mockOnPageChange).toHaveBeenCalledWith(1);
      });

      it("powinien wywołać onPageChange z następną stroną", () => {
        const mockOnPageChange = vi.fn();
        render(<CategoriesList {...defaultProps} onPageChange={mockOnPageChange} />);

        const nextButton = screen.getByText("Następna");
        fireEvent.click(nextButton);

        expect(mockOnPageChange).toHaveBeenCalledWith(2);
      });
    });
  });

  describe("Responsywność", () => {
    it("powinien ukryć przyciski mobile na dużych ekranach", () => {
      render(<CategoriesList {...defaultProps} />);

      const mobileButtons = screen.getByText("Poprzednia").closest("div");
      expect(mobileButtons).toHaveClass("flex-1", "flex", "justify-between", "sm:hidden");
    });
  });

  describe("Dostępność", () => {
    it("powinien mieć prawidłowe atrybuty dostępności dla przycisków", () => {
      render(<CategoriesList {...defaultProps} />);

      const addButton = screen.getByText("Dodaj kategorię");
      expect(addButton).toHaveAttribute("class");
      // Sprawdź czy przycisk ma odpowiednie klasy dla dostępności
      expect(addButton.className).toContain("disabled:opacity-50");
      expect(addButton.className).toContain("disabled:cursor-not-allowed");
    });
  });
});
