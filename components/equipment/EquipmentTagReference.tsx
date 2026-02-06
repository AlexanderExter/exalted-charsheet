"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ArmorPiece, Weapon } from "@/lib/character-types";

interface EquipmentTagReferenceProps {
  armor: ArmorPiece[];
  weapons: Weapon[];
}

type SortKey = "tag" | "items";
type SortDir = "asc" | "desc";

export const EquipmentTagReference: React.FC<EquipmentTagReferenceProps> = ({ armor, weapons }) => {
  const [sortKey, setSortKey] = useState<SortKey>("tag");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filter, setFilter] = useState("");

  const items = useMemo(() => [...armor, ...weapons], [armor, weapons]);

  const rows = useMemo(() => {
    const allTags = new Set<string>();
    items.forEach(item => {
      item.tags.forEach(tag => {
        const trimmed = tag.trim();
        if (trimmed) {
          allTags.add(trimmed);
        }
      });
    });

    let tagRows = Array.from(allTags).map(tag => ({
      tag,
      items: items
        .filter(item => item.tags.includes(tag))
        .map(item => item.name || "Unnamed")
        .join(", "),
    }));

    if (filter) {
      const lower = filter.toLowerCase();
      tagRows = tagRows.filter(
        row => row.tag.toLowerCase().includes(lower) || row.items.toLowerCase().includes(lower)
      );
    }

    tagRows.sort((a, b) => {
      const aVal = sortKey === "tag" ? a.tag : a.items;
      const bVal = sortKey === "tag" ? b.tag : b.items;
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return tagRows;
  }, [items, filter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return null;
    }
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Tag Reference</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-2">
            <Input
              placeholder="Filter tags..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="mb-2"
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-2 px-3 text-left text-sm">
                      <button
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("tag")}
                      >
                        Tag{sortIndicator("tag")}
                      </button>
                    </th>
                    <th className="py-2 px-3 text-left text-sm">
                      <button
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("items")}
                      >
                        Used On{sortIndicator("items")}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.tag} className="border-b border-border">
                      <td className="py-2 px-3 text-left text-sm">
                        <span className="font-medium text-foreground/80">{row.tag}</span>
                      </td>
                      <td className="py-2 px-3 text-left text-sm">
                        <span className="text-xs text-muted-foreground/80">{row.items}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground/80 italic">No equipment tags to reference.</p>
        )}
      </CardContent>
    </Card>
  );
};

EquipmentTagReference.displayName = "EquipmentTagReference";
