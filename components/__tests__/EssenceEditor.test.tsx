import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EssenceEditor } from "@/components/EssenceEditor";
import { createDefaultEssence } from "@/lib/character-defaults";


describe("EssenceEditor", () => {
  it("updates motes when rating changes", () => {
    const essence = createDefaultEssence();
    const handleChange = vi.fn();
    render(<EssenceEditor essence={essence} onChange={handleChange} />);
    const ratingInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(ratingInput, { target: { value: "3" } });
    expect(handleChange).toHaveBeenCalledWith({ ...essence, rating: 3, motes: 10 });
  });

  it("renders motes as text without input field", () => {
    const essence = createDefaultEssence();
    render(<EssenceEditor essence={essence} onChange={() => {}} />);
    expect(screen.getByText("Motes")).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton", { name: "Motes" })).not.toBeInTheDocument();
    const motesRow = screen.getByText("Motes").closest("div");
    expect(motesRow).toBeTruthy();
    if (motesRow) {
      expect(motesRow.textContent).toContain("5");
    }
  });
});

