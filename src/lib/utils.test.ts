import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("handles conditional classes", () => {
    const condition = true;
    expect(cn("base", condition && "conditional")).toBe("base conditional");

    const falseCondition = false;
    expect(cn("base", falseCondition && "conditional")).toBe("base");
  });

  it("handles undefined and null values", () => {
    expect(cn("base", undefined, null, "valid")).toBe("base valid");
  });

  it("merges conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles array of classes", () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("handles single class", () => {
    expect(cn("single-class")).toBe("single-class");
  });

  it("preserves important classes", () => {
    expect(cn("px-2", "px-4!")).toBe("px-2 px-4!");
  });

  it("handles complex Tailwind combinations", () => {
    expect(cn("flex items-center justify-between", "px-4 py-2", "bg-blue-500 hover:bg-blue-600")).toBe(
      "flex items-center justify-between px-4 py-2 bg-blue-500 hover:bg-blue-600"
    );
  });
});


