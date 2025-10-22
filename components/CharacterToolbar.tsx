"use client";

import { useRef } from "react";
import { Download, Upload, User, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Character } from "@/lib/character-types";

interface CharacterToolbarProps {
  character: Character;
  isSaving: boolean;
  lastSaved: Date | null;
  onExport: (character: Character) => Promise<void>;
  onImport: (file: File) => Promise<void>;
  onSwitch: () => void;
}

export function CharacterToolbar({
  character,
  isSaving,
  lastSaved,
  onExport,
  onImport,
  onSwitch,
}: CharacterToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImport(file);
      e.target.value = "";
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{character.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : lastSaved ? (
                  <>
                    <Save className="w-4 h-4" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </>
                ) : null}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Characters are saved automatically in your browser&apos;s local storage.</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="outline" size="sm" onClick={() => onExport(character)}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>

          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>

          <Button variant="outline" size="sm" onClick={onSwitch}>
            <User className="w-4 h-4 mr-1" />
            Switch
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}

export default CharacterToolbar;
