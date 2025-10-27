import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CategoryDTO } from "../../types";
import { FilterControls } from "./FilterControls";

describe("FilterControls", () => {
  const mockCategories: CategoryDTO[] = [
    { id: "cat1", name: "Jedzenie", is_default: true, created_at: "2024-01-01T00:00:00Z" },
    { id: "cat2", name: "Transport", is_default: false, created_at: "2024-01-01T00:00:00Z" },
  ];

  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render filter controls", () => {
    render(
      <FilterControls
        categories={mockCategories}
        currentMonth={undefined}
        currentCategoryId={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText("Filtruj po miesiącu")).toBeInTheDocument();
    expect(screen.getByText("Filtruj po kategorii")).toBeInTheDocument();
  });

  it("should show active filters information", () => {
    render(
      <FilterControls
        categories={mockCategories}
        currentMonth="2024-01"
        currentCategoryId="cat1"
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText(/Aktywne filtry:/)).toBeInTheDocument();
    expect(screen.getByText(/Miesiąc: styczeń 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Kategoria: Jedzenie/)).toBeInTheDocument();
  });

  it("should show clear filters button when filters are active", () => {
    render(
      <FilterControls
        categories={mockCategories}
        currentMonth="2024-01"
        currentCategoryId={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByRole("button", { name: /wyczyść filtry/i })).toBeInTheDocument();
  });

  it("should not show clear filters button when no filters are active", () => {
    render(
      <FilterControls
        categories={mockCategories}
        currentMonth={undefined}
        currentCategoryId={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.queryByRole("button", { name: /wyczyść filtry/i })).not.toBeInTheDocument();
  });

  it("should call onFilterChange when month is selected", async () => {
    render(
      <FilterControls
        categories={mockCategories}
        currentMonth={undefined}
        currentCategoryId={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    const monthSelect = screen.getByRole("combobox", { name: /filtruj po miesiącu/i });
    fireEvent.click(monthSelect);

    const option = screen.getByText("sty 2024");
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith("2024-01", undefined);
    });
  });

  it('should call onFilterChange with undefined when "all months" is selected', async () => {
    render(
      <FilterControls
        categories={mockCategories}
        currentMonth="2024-01"
        currentCategoryId={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    const monthSelect = screen.getByRole("combobox", { name: /filtruj po miesiącu/i });
    fireEvent.click(monthSelect);

    const option = screen.getByText("Wszystkie miesiące");
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  it("should call onFilterChange when category is selected", async () => {
    render(
      <FilterControls
        categories={mockCategories}
        currentMonth={undefined}
        currentCategoryId={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    const categorySelect = screen.getByRole("combobox", { name: /filtruj po kategorii/i });
    fireEvent.click(categorySelect);

    const option = screen.getByText("Jedzenie");
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(undefined, "cat1");
    });
  });

  it("should call onFilterChange when clear filters is clicked", () => {
    render(
      <FilterControls
        categories={mockCategories}
        currentMonth="2024-01"
        currentCategoryId="cat1"
        onFilterChange={mockOnFilterChange}
      />
    );

    const clearButton = screen.getByRole("button", { name: /wyczyść filtry/i });
    fireEvent.click(clearButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(undefined, undefined);
  });

  it("should handle empty categories array", () => {
    render(
      <FilterControls
        categories={[]}
        currentMonth={undefined}
        currentCategoryId={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    const categorySelect = screen.getByRole("combobox", { name: /filtruj po kategorii/i });
    fireEvent.click(categorySelect);

    // Should only show "Wszystkie kategorie" option
    expect(screen.getByText("Wszystkie kategorie")).toBeInTheDocument();
    expect(screen.queryByText("Jedzenie")).not.toBeInTheDocument();
  });

  it("should generate correct month options", () => {
    // Mock current date to ensure consistent test results
    const mockDate = new Date("2024-06-15");
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    render(
      <FilterControls
        categories={mockCategories}
        currentMonth={undefined}
        currentCategoryId={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    const monthSelect = screen.getByRole("combobox", { name: /filtruj po miesiącu/i });
    fireEvent.click(monthSelect);

    // Should show months from current back 24 months
    expect(screen.getByText("cze 2024")).toBeInTheDocument(); // Current month
    expect(screen.getByText("cze 2022")).toBeInTheDocument(); // 24 months back

    vi.useRealTimers();
  });
});
