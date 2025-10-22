"use client";

import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ArmorPiece, Weapon } from "@/lib/character-types";

interface EquipmentTagReferenceProps {
  armor: ArmorPiece[];
  weapons: Weapon[];
}

export const EquipmentTagReference: React.FC<EquipmentTagReferenceProps> = ({ armor, weapons }) => {
  const items = useMemo(() => [...armor, ...weapons], [armor, weapons]);

  interface TagRow {
    tag: string;
    items: string;
  }

  const data = useMemo<TagRow[]>(() => {
    const allTags = new Set<string>();
    items.forEach(item => {
      item.tags.forEach(tag => {
        const trimmed = tag.trim();
        if (trimmed) allTags.add(trimmed);
      });
    });
    return Array.from(allTags).map(tag => ({
      tag,
      items: items
        .filter(item => item.tags.includes(tag))
        .map(item => item.name || "Unnamed")
        .join(", "),
    }));
  }, [items]);

  const columns = React.useMemo<ColumnDef<TagRow>[]>(
    () => [
      {
        accessorKey: "tag",
        header: ({ column }) => (
          <button
            className="text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tag
          </button>
        ),
        cell: ({ row }) => <span className="font-medium text-gray-700">{row.getValue("tag")}</span>,
      },
      {
        accessorKey: "items",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-left"
          >
            Used On
          </button>
        ),
        cell: ({ row }) => <span className="text-xs text-gray-500">{row.getValue("items")}</span>,
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Tag Reference</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-2">
            <Input
              placeholder="Filter tags..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="mb-2"
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="py-2 px-3 text-left text-sm">
                          {header.isPlaceholder ? null : (
                            <div
                              className={
                                header.column.getCanSort() ? "cursor-pointer select-none" : ""
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ??
                                null}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="border-b border-gray-200">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="py-2 px-3 text-left text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No equipment tags to reference.</p>
        )}
      </CardContent>
    </Card>
  );
};

EquipmentTagReference.displayName = "EquipmentTagReference";
