import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Essence } from "@/lib/character-types";

interface EssenceEditorProps {
  essence: Essence;
  onChange: (essence: Essence) => void;
}

export const EssenceEditor: React.FC<EssenceEditorProps> = React.memo(({ essence, onChange }) => {
  const update = (field: keyof Essence, value: number) => {
    onChange({ ...essence, [field]: value });
  };

  const rating = essence.rating ?? 1;
  const motes = essence.motes ?? 5;
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
            const value = Math.max(0, Math.min(10, Number.parseInt(e.target.value) || 0));
            update("rating", value);
          }}
          className="w-20 text-center"
          min={0}
          max={10}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Motes</Label>
        <Input
          type="number"
          value={motes}
          onChange={e => {
            const value = Math.max(0, Math.min(50, Number.parseInt(e.target.value) || 0));
            update("motes", value);
          }}
          className="w-20 text-center"
          min={0}
          max={50}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Commitments</Label>
        <Input
          type="number"
          value={commitments}
          onChange={e => {
            const value = Math.max(0, Number.parseInt(e.target.value) || 0);
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
            const value = Math.max(0, Number.parseInt(e.target.value) || 0);
            update("spent", value);
          }}
          className="w-20 text-center"
          min={0}
        />
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-blue-600">Remain</Label>
          <span className="font-bold text-blue-600">{remain}</span>
        </div>
        <div className="flex items-center justify-between">
          <Label className="font-medium text-green-600">Open</Label>
          <span className="font-bold text-green-600">{open}</span>
        </div>
      </div>
    </div>
  );
});

EssenceEditor.displayName = "EssenceEditor";

export default EssenceEditor;
