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

  it("updates remain and open when fields are cleared or retyped", () => {
    const TestWrapper: React.FC = () => {
      const [essence, setEssence] = React.useState(createDefaultEssence());
      return <EssenceEditor essence={essence} onChange={setEssence} />;
    };
    render(<TestWrapper />);
    const [ratingInput, commitmentsInput, spentInput] = screen.getAllByRole("spinbutton");
    const remainRow = screen.getByText("Remain").closest("div") as HTMLElement;
    const openRow = screen.getByText("Open").closest("div") as HTMLElement;
    expect(remainRow).toHaveTextContent("5");
    expect(openRow).toHaveTextContent("5");
    fireEvent.change(commitmentsInput, { target: { value: "2" } });
    expect(remainRow).toHaveTextContent("3");
    expect(openRow).toHaveTextContent("3");
    fireEvent.change(commitmentsInput, { target: { value: "" } });
    expect(remainRow).toHaveTextContent("5");
    expect(openRow).toHaveTextContent("5");
    fireEvent.change(spentInput, { target: { value: "1" } });
    expect(remainRow).toHaveTextContent("4");
    expect(openRow).toHaveTextContent("5");
    fireEvent.change(spentInput, { target: { value: "" } });
    expect(remainRow).toHaveTextContent("5");
    expect(openRow).toHaveTextContent("5");
    fireEvent.change(ratingInput, { target: { value: "3" } });
    expect(remainRow).toHaveTextContent("10");
    expect(openRow).toHaveTextContent("10");
    fireEvent.change(ratingInput, { target: { value: "" } });
    expect(remainRow).toHaveTextContent("10");
    expect(openRow).toHaveTextContent("10");
    fireEvent.change(ratingInput, { target: { value: "4" } });
    expect(remainRow).toHaveTextContent("12");
    expect(openRow).toHaveTextContent("12");
  });
});

