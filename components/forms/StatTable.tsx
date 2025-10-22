"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { type StatBlock } from "@/lib/character-types";
import type { StatConfig } from "@/lib/stat-config";

interface StatTableProps<T extends string> {
  config: StatConfig<T>[];
  stats: Record<T, StatBlock>;
  onChange: (key: T, stat: StatBlock) => void;
  getTotal: (key: T) => number;
  minBase?: number;
  totalColorClass?: string;
  scrollable?: boolean;
}

export function StatTable<T extends string>({
  config,
  stats,
  onChange,
  getTotal,
  minBase = 0,
  totalColorClass,
  scrollable = false,
}: StatTableProps<T>) {
  const wrapperClass = scrollable ? "max-h-96 overflow-y-auto" : "overflow-x-auto";
  const theadClass = scrollable ? "sticky top-0 bg-gray-100" : "bg-gray-100";

  interface StatRow {
    key: T;
    label: string;
    colorClass: string;
    stat: StatBlock;
  }

  const data = React.useMemo<StatRow[]>(
    () =>
      config.map(item => ({
        key: item.key,
        label: item.label,
        colorClass: item.colorClass || "text-gray-700",
        stat: stats[item.key] ?? { base: minBase, added: 0, bonus: 0 },
      })),
    [config, stats, minBase]
  );

  const columns = React.useMemo<ColumnDef<StatRow>[]>(
    () => [
      {
        accessorKey: "label",
        header: ({ column }) => (
          <button
            className="text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
          </button>
        ),
        cell: ({ row }) => (
          <span className={`font-medium text-sm capitalize ${row.original.colorClass}`}>
            {row.getValue<string>("label")}
          </span>
        ),
      },
      {
        id: "base",
        accessorFn: row => row.stat.base,
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Base
          </button>
        ),
        cell: ({ row }) => {
          const stat = row.original.stat ?? { base: minBase, added: 0, bonus: 0 };
          return (
            <Input
              type="number"
              value={stat.base}
              onChange={e => {
                const value = Math.max(
                  minBase,
                  Math.min(5, Number.parseInt(e.target.value) || minBase)
                );
                onChange(row.original.key, { ...stat, base: value });
              }}
              className="w-16 text-center text-sm"
              min={minBase}
              max={5}
            />
          );
        },
      },
      {
        id: "added",
        accessorFn: row => row.stat.added,
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Added
          </button>
        ),
        cell: ({ row }) => {
          const stat = row.original.stat ?? { base: minBase, added: 0, bonus: 0 };
          const maxAdded = Math.max(0, 5 - stat.base);
          return (
            <Input
              type="number"
              value={stat.added}
              onChange={e => {
                const value = Math.min(maxAdded, Math.max(0, Number.parseInt(e.target.value) || 0));
                onChange(row.original.key, { ...stat, added: value });
              }}
              className="w-16 text-center text-sm"
              min={0}
              max={maxAdded}
            />
          );
        },
      },
      {
        id: "bonus",
        accessorFn: row => row.stat.bonus,
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Bonus
          </button>
        ),
        cell: ({ row }) => {
          const stat = row.original.stat ?? { base: minBase, added: 0, bonus: 0 };
          return (
            <Input
              type="number"
              value={stat.bonus}
              onChange={e => {
                const value = Math.max(0, Number.parseInt(e.target.value) || 0);
                onChange(row.original.key, { ...stat, bonus: value });
              }}
              className="w-16 text-center text-sm"
              min={0}
            />
          );
        },
      },
      {
        id: "total",
        accessorFn: row => getTotal(row.key),
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full text-center"
          >
            Total
          </button>
        ),
        cell: ({ row }) => (
          <span
            className={`font-bold text-center text-sm ${
              totalColorClass || row.original.colorClass
            }`}
          >
            {row.getValue<number>("total")}
          </span>
        ),
      },
    ],
    [minBase, onChange, getTotal, totalColorClass]
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
    <div className={wrapperClass}>
      <Input
        placeholder="Filter stats..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        className="mb-2"
      />
      <table className="w-full">
        <thead className={theadClass}>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="py-2 px-3 text-sm">
                  {header.isPlaceholder ? null : (
                    <div
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ?? null}
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
                <td key={cell.id} className="py-2 px-3 text-center text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-xs text-gray-400 italic">Base + Added cannot exceed 5</div>
    </div>
  );
}

export default StatTable;
