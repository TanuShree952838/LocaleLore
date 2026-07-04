import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DestinationPreferencesForm } from "@/components/form/DestinationPreferencesForm";

describe("DestinationPreferencesForm", () => {
  it("renders key fields and the submit button", () => {
    render(<DestinationPreferencesForm onSubmit={vi.fn()} isLoading={false} />);
    expect(
      screen.getByRole("button", { name: /unveil my cultural odyssey/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/where to\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
  });

  it("submits a valid context when form is properly filled", () => {
    const onSubmit = vi.fn();
    render(<DestinationPreferencesForm onSubmit={onSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/where to\?/i), { target: { value: "Kyoto, Japan" } });
    fireEvent.change(screen.getByLabelText(/budget/i), { target: { value: "600" } });

    fireEvent.click(screen.getByRole("button", { name: /unveil my cultural odyssey/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const context = onSubmit.mock.calls[0]![0];
    expect(context.destination).toBe("Kyoto, Japan");
    expect(context.budget).toBe(600);
    expect(context.days).toBe(2);
    expect(context.travelStyle).toBe("balanced");
    expect(context.residentGuide).toBe("historian");
  });

  it("shows a validation error and blocks submit on empty destination", async () => {
    const onSubmit = vi.fn();
    render(<DestinationPreferencesForm onSubmit={onSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/where to\?/i), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /unveil my cultural odyssey/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText(/destination must be at least 2 characters/i)).toBeInTheDocument();
  });

  it("disables the button while loading", () => {
    render(<DestinationPreferencesForm onSubmit={vi.fn()} isLoading />);
    // Our Button uses a loading indicator or standard disabled styling. Let's verify it is disabled.
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
