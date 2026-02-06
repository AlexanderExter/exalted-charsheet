"use client";

import { useMemo, useState } from "react";
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

type SortKey = "label" | "base" | "added" | "bonus" | "total";
type SortDir = "asc" | "desc";

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
  const theadClass = scrollable ? "sticky top-0 bg-muted" : "bg-muted";

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const rows = useMemo(() => {
    const mapped = config.map(item => {
      const stat = stats[item.key] ?? { base: minBase, added: 0, bonus: 0 };
      return {
        key: item.key,
        label: item.label,
        colorClass: item.colorClass || "text-foreground",
        stat,
        total: getTotal(item.key),
      };
    });

    if (!sortKey) {
      return mapped;
    }

    return [...mapped].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      switch (sortKey) {
        case "label":
          aVal = a.label;
          bVal = b.label;
          break;
        case "base":
          aVal = a.stat.base;
          bVal = b.stat.base;
          break;
        case "added":
          aVal = a.stat.added;
          bVal = b.stat.added;
          break;
        case "bonus":
          aVal = a.stat.bonus;
          bVal = b.stat.bonus;
          break;
        case "total":
          aVal = a.total;
          bVal = b.total;
          break;
      }
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [config, stats, minBase, getTotal, sortKey, sortDir]);

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return null;
    }
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className={wrapperClass}>
      <table className="w-full">
        <thead className={theadClass}>
          <tr>
            <th className="py-2 px-3 text-sm">
              <button className="text-left cursor-pointer select-none" onClick={() => handleSort("label")}>
                Name{sortIndicator("label")}
              </button>
            </th>
            {(["base", "added", "bonus", "total"] as const).map(col => (
              <th key={col} className="py-2 px-3 text-sm">
                <button
                  className="w-full text-center cursor-pointer select-none"
                  onClick={() => handleSort(col)}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {sortIndicator(col)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const stat = row.stat;
            const maxAdded = Math.max(0, 5 - stat.base);
            return (
              <tr key={row.key} className="border-b border-border">
                <td className="py-2 px-3 text-sm">
                  <span className={`font-medium capitalize ${row.colorClass}`}>{row.label}</span>
                </td>
                <td className="py-2 px-3 text-center text-sm">
                  <Input
                    type="number"
                    value={stat.base}
                    onChange={e => {
                      const value = Math.max(
                        minBase,
                        Math.min(5, Number.parseInt(e.target.value) || minBase)
                      );
                      onChange(row.key, { ...stat, base: value });
                    }}
                    className="w-16 text-center text-sm"
                    min={minBase}
                    max={5}
                  />
                </td>
                <td className="py-2 px-3 text-center text-sm">
                  <Input
                    type="number"
                    value={stat.added}
                    onChange={e => {
                      const value = Math.min(
                        maxAdded,
                        Math.max(0, Number.parseInt(e.target.value) || 0)
                      );
                      onChange(row.key, { ...stat, added: value });
                    }}
                    className="w-16 text-center text-sm"
                    min={0}
                    max={maxAdded}
                  />
                </td>
                <td className="py-2 px-3 text-center text-sm">
                  <Input
                    type="number"
                    value={stat.bonus}
                    onChange={e => {
                      const value = Math.max(0, Number.parseInt(e.target.value) || 0);
                      onChange(row.key, { ...stat, bonus: value });
                    }}
                    className="w-16 text-center text-sm"
                    min={0}
                  />
                </td>
                <td className="py-2 px-3 text-center text-sm">
                  <span className={`font-bold ${totalColorClass || row.colorClass}`}>
                    {row.total}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-2 text-xs text-muted-foreground italic">Base + Added cannot exceed 5</div>
    </div>
  );
}

export default StatTable;
