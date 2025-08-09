import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EssencePanel } from "../EssencePanel";
import { createDefaultEssence } from "@/lib/character-defaults";

describe("EssencePanel", () => {
  it("renders essence editor and anima controls", () => {
    const essence = createDefaultEssence();
    render(<EssencePanel essence={essence} onChange={() => {}} />);
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("Anima Level")).toBeInTheDocument();
    for (let i = 0; i <= 10; i++) {
      expect(screen.getAllByText(String(i))[0]).toBeInTheDocument();
    }
  });

  it("calls onChange when anima slider changes", () => {
    const essence = createDefaultEssence();
    const handleChange = vi.fn();
    render(<EssencePanel essence={essence} onChange={handleChange} />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "5" } });
    expect(handleChange).toHaveBeenCalledWith({ ...essence, anima: 5 });
  });
});
