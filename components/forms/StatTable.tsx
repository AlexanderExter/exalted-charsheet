import React from "react";
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

  return (
    <div className={wrapperClass}>
      <table className="w-full">
        <thead className={theadClass}>
          <tr>
            <th className="py-2 px-3 text-left text-sm">Name</th>
            <th className="py-2 px-3 text-center text-sm">Base</th>
            <th className="py-2 px-3 text-center text-sm">Added</th>
            <th className="py-2 px-3 text-center text-sm">Bonus</th>
            <th className="py-2 px-3 text-center text-sm">Total</th>
          </tr>
        </thead>
        <tbody>
          {config.map(item => {
            const stat = stats[item.key];
            const color = item.colorClass || "text-gray-700";
            const totalColor = totalColorClass || color;
            const maxAdded = Math.max(0, 5 - stat.base);
            return (
              <tr key={item.key} className="border-b border-gray-200">
                <td className={`py-2 px-3 font-medium text-sm capitalize ${color}`}>{item.label}</td>
                <td className="py-2 px-3">
                  <Input
                    type="number"
                    value={stat.base}
                    onChange={e => {
                      const value = Math.max(
                        minBase,
                        Math.min(5, Number.parseInt(e.target.value) || minBase),
                      );
                      onChange(item.key, { ...stat, base: value });
                    }}
                    className="w-16 text-center text-sm"
                    min={minBase}
                    max={5}
                  />
                </td>
                <td className="py-2 px-3">
                  <Input
                    type="number"
                    value={stat.added}
                    onChange={e => {
                      const value = Math.min(
                        maxAdded,
                        Math.max(0, Number.parseInt(e.target.value) || 0),
                      );
                      onChange(item.key, { ...stat, added: value });
                    }}
                    className="w-16 text-center text-sm"
                    min={0}
                    max={maxAdded}
                  />
                </td>
                <td className="py-2 px-3">
                  <Input
                    type="number"
                    value={stat.bonus}
                    onChange={e => {
                      const value = Math.max(0, Number.parseInt(e.target.value) || 0);
                      onChange(item.key, { ...stat, bonus: value });
                    }}
                    className="w-16 text-center text-sm"
                    min={0}
                  />
                </td>
                <td className={`py-2 px-3 font-bold text-center text-sm ${totalColor}`}>
                  {getTotal(item.key)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-2 text-xs text-gray-400 italic">Base + Added cannot exceed 5</div>
    </div>
  );
}

export default StatTable;
