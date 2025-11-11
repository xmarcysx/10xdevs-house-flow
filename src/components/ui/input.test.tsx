import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders with default props", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders with custom type", () => {
    render(<Input type="email" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter your name" />);

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("calls onChange handler", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "a");

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Input disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" />);

    expect(screen.getByRole("textbox")).toHaveClass("custom-input");
  });

  it("forwards other props", () => {
    render(<Input data-testid="custom-input" maxLength={10} />);

    const input = screen.getByTestId("custom-input");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("handles numeric input", async () => {
    const user = userEvent.setup();
    render(<Input type="number" />);

    const input = screen.getByRole("spinbutton");
    await user.type(input, "123");

    expect(input).toHaveValue(123);
  });
});


