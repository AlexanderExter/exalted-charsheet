"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Essence } from "@/lib/character-types";

interface EssenceEditorProps {
  essence: Essence;
  onChange: (essence: Essence) => void;
}

export const EssenceEditor: React.FC<EssenceEditorProps> = ({ essence, onChange }) => {
  const update = (field: keyof Essence, value: number) => {
    onChange({ ...essence, [field]: value });
  };

  const motesByEssence: Record<number, number> = {
    1: 5,
    2: 7,
    3: 10,
    4: 12,
    5: 15,
  };

  const rating = essence.rating ?? 1;
  const motes = motesByEssence[rating] ?? 0;
  const commitments = essence.commitments ?? 0;
  const spent = essence.spent ?? 0;

  const remain = motes - commitments - spent;
  const open = motes - commitments;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Rating</Label>
        <Input
          type="number"
          value={rating}
          onChange={e => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value)) {
              value = rating;
            }
            value = Math.max(1, Math.min(5, value));
            onChange({ ...essence, rating: value, motes: motesByEssence[value] ?? 0 });
          }}
          className="w-20 text-center"
          min={1}
          max={5}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Motes</Label>
        <span className="font-bold">{motes}</span>
      </div>
      <div className="flex items-center justify-between">
        <Label>Commitments</Label>
        <Input
          type="number"
          value={commitments}
          onChange={e => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value)) {
              value = 0;
            }
            value = Math.max(0, value);
            update("commitments", value);
          }}
          className="w-20 text-center"
          min={0}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Spent</Label>
        <Input
          type="number"
          value={spent}
          onChange={e => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value)) {
              value = 0;
            }
            value = Math.max(0, value);
            update("spent", value);
          }}
          className="w-20 text-center"
          min={0}
        />
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-info">Remain</Label>
          <span className="font-bold text-info">{remain}</span>
        </div>
        <div className="flex items-center justify-between">
          <Label className="font-medium text-success">Open</Label>
          <span className="font-bold text-success">{open}</span>
        </div>
      </div>
    </div>
  );
};

EssenceEditor.displayName = "EssenceEditor";

export default EssenceEditor;
