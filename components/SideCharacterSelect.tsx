"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SideCharacter } from "@/lib/character-types";

interface SideCharacterSelectProps {
  sideCharacters: SideCharacter[];
  onCreateSideCharacter: (name: string) => void;
  onSelectSideCharacter: (id: string) => void;
  onDeleteSideCharacter: (id: string) => void;
}

export const SideCharacterSelect: React.FC<SideCharacterSelectProps> = ({
  sideCharacters,
  onCreateSideCharacter,
  onSelectSideCharacter,
  onDeleteSideCharacter,
}) => {
  const [newSideCharacterName, setNewSideCharacterName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSideCharacters = useMemo(
    () => sideCharacters.filter(sc => sc.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [sideCharacters, searchTerm]
  );

  const handleCreate = () => {
    if (!newSideCharacterName.trim()) return;
    onCreateSideCharacter(newSideCharacterName.trim());
    setNewSideCharacterName("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Side Characters</CardTitle>
        <CardDescription>
          Manage NPCs, allies, and antagonists with simplified stat blocks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create new side character */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Create New Side Character</h3>
          <div className="flex gap-3">
            <Input
              value={newSideCharacterName}
              onChange={e => setNewSideCharacterName(e.target.value)}
              placeholder="Side character name..."
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
            />
            <Button onClick={handleCreate} disabled={!newSideCharacterName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Side character list */}
        {sideCharacters.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Your Side Characters</h3>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>

            <div className="grid gap-2">
              {filteredSideCharacters.map(sideCharacter => (
                <div
                  key={sideCharacter.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-border hover:shadow-md hover:border-border transition-all cursor-pointer group"
                  onClick={() => onSelectSideCharacter(sideCharacter.id)}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{sideCharacter.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {sideCharacter.battlegroup ? `Battlegroup (Size ${sideCharacter.battlegroup.size})` : "Individual"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${sideCharacter.name}"? This action cannot be undone.`
                          )
                        ) {
                          onDeleteSideCharacter(sideCharacter.id);
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

        {sideCharacters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No side characters yet. Create one above to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SideCharacterSelect;
