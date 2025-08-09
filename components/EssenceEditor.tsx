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
  const remainPercent = motes > 0 ? Math.max(0, Math.min(100, (remain / motes) * 100)) : 0;
  const openPercent = motes > 0 ? Math.max(0, Math.min(100, (open / motes) * 100)) : 0;

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
        <div className="space-y-1">
          <Label className="font-medium text-blue-600">Remain</Label>
          <div className="relative h-4 w-full rounded bg-blue-200">
            <div
              className="h-full rounded bg-blue-600"
              style={{ width: `${remainPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">
              {remain}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="font-medium text-green-600">Open</Label>
          <div className="relative h-4 w-full rounded bg-green-200">
            <div
              className="h-full rounded bg-green-600"
              style={{ width: `${openPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-600">
              {open}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

EssenceEditor.displayName = "EssenceEditor";

export default EssenceEditor;
