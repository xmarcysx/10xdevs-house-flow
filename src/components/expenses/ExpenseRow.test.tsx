import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ExpenseDTO } from "../../types";
import { ExpenseRow } from "./ExpenseRow";

describe("ExpenseRow", () => {
  const mockExpense: ExpenseDTO = {
    id: "1",
    amount: 100.5,
    date: "2024-01-15",
    description: "Lunch at restaurant",
    category_id: "cat1",
    category_name: "Jedzenie",
    created_at: "2024-01-15T12:00:00Z",
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it("should render expense data correctly", () => {
    render(<ExpenseRow expense={mockExpense} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Check if date is formatted correctly (Polish locale)
    expect(screen.getByText("15 sty 2024")).toBeInTheDocument();

    // Check if amount is formatted as currency
    expect(screen.getByText("100,50 zł")).toBeInTheDocument();

    // Check category name
    expect(screen.getByText("Jedzenie")).toBeInTheDocument();

    // Check description
    expect(screen.getByText("Lunch at restaurant")).toBeInTheDocument();
  });

  it("should render dash when description is empty", () => {
    const expenseWithoutDescription = { ...mockExpense, description: undefined };

    render(<ExpenseRow expense={expenseWithoutDescription} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", () => {
    render(<ExpenseRow expense={mockExpense} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButton = screen.getByRole("button", { name: /edytuj/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockExpense);
  });

  it("should call onDelete when delete button is clicked", () => {
    render(<ExpenseRow expense={mockExpense} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole("button", { name: /usuń/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("should have correct accessibility attributes", () => {
    render(<ExpenseRow expense={mockExpense} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButton = screen.getByRole("button", { name: /edytuj/i });
    const deleteButton = screen.getByRole("button", { name: /usuń/i });

    expect(editButton).toHaveAttribute("title", "Edytuj");
    expect(deleteButton).toHaveAttribute("title", "Usuń");
  });

  it("should apply hover styles", () => {
    render(<ExpenseRow expense={mockExpense} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const row = screen.getByRole("row");
    expect(row).toHaveClass("hover:bg-gray-50", "dark:hover:bg-gray-800/50");
  });
});
