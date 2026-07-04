import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DayContextForm } from "@/components/form/DayContextForm";

describe("DayContextForm", () => {
  it("renders key fields and the submit button", () => {
    render(<DayContextForm onSubmit={vi.fn()} isSubmitting={false} />);
    expect(
      screen.getByRole("button", { name: /generate my cooking plan/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/which meals do you want to plan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/daily budget/i)).toBeInTheDocument();
  });

  it("submits a valid default context", () => {
    const onSubmit = vi.fn();
    render(<DayContextForm onSubmit={onSubmit} isSubmitting={false} />);
    fireEvent.click(screen.getByRole("button", { name: /generate my cooking plan/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const context = onSubmit.mock.calls[0]![0];
    expect(context.budget).toBe(500);
    expect(context.servings).toBe(2);
    expect(context.includeMeals).toEqual(
      expect.arrayContaining(["breakfast", "lunch", "dinner"]),
    );
  });

  it("shows a validation error and blocks submit on invalid budget", async () => {
    const onSubmit = vi.fn();
    render(<DayContextForm onSubmit={onSubmit} isSubmitting={false} />);

    fireEvent.change(screen.getByLabelText(/daily budget/i), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /generate my cooking plan/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText(/budget must be greater than zero/i)).toBeInTheDocument();
  });

  it("disables the button while submitting", () => {
    render(<DayContextForm onSubmit={vi.fn()} isSubmitting />);
    expect(screen.getByRole("button", { name: /planning your day/i })).toBeDisabled();
  });
});
