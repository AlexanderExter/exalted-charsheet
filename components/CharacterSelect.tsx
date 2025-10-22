"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, User, Download, Upload, Search, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportCharacters } from "@/lib/character-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Character } from "@/lib/character-types";

interface CharacterSelectProps {
  characters: Character[];
  onCreateCharacter: (name: string) => void;
  onSelectCharacter: (id: string) => void;
  onDeleteCharacter: (id: string) => void;
  onExportCharacter: (character: Character) => void;
  importCharacter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  characters,
  onCreateCharacter,
  onSelectCharacter,
  onDeleteCharacter,
  onExportCharacter,
  importCharacter,
  isSaving,
  lastSaved,
  fileInputRef,
}) => {
  const [newCharacterName, setNewCharacterName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCharacters = useMemo(
    () => characters.filter(char => char.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [characters, searchTerm]
  );

  const handleCreate = () => {
    if (!newCharacterName.trim()) return;
    onCreateCharacter(newCharacterName.trim());
    setNewCharacterName("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Exalted: Essence Character Manager</CardTitle>
          <CardDescription className="text-center">
            Create and manage your Exalted characters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-save indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-help">
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : lastSaved ? (
                  <>
                    <Save className="w-4 h-4" />
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </>
                ) : null}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Characters are saved automatically in your browser&apos;s local storage</p>
            </TooltipContent>
          </Tooltip>

          {/* Import/Export Controls */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import Character(s)
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importCharacter}
              className="hidden"
            />
            {characters.length > 0 && (
              <Button variant="outline" onClick={() => exportCharacters()}>
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            )}
          </div>

          {/* Create new character */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Create New Character</h3>
            <div className="flex gap-3">
              <Input
                value={newCharacterName}
                onChange={e => setNewCharacterName(e.target.value)}
                placeholder="Character name..."
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
              />
              <Button onClick={handleCreate} disabled={!newCharacterName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          {/* Character list */}
          {characters.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Character</h3>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Input
                    placeholder="Search characters..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                {filteredCharacters.map(character => (
                  <div
                    key={character.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-border hover:shadow-md hover:border-border transition-all cursor-pointer group"
                    onClick={() => onSelectCharacter(character.id)}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{character.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Essence {character.essence?.rating || 1}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          onExportCharacter(character);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              `Are you sure you want to delete "${character.name}"? This action cannot be undone.`
                            )
                          ) {
                            onDeleteCharacter(character.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterSelect;
