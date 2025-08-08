import React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { calculateStatTotal } from "@/lib/exalted-utils"
import type { StatBlock } from "@/lib/character-types"
import { clamp } from "@/lib/validation"

interface StatBlockEditorProps {
  label: React.ReactNode
  value: StatBlock
  onChange: (value: StatBlock) => void
  minBase?: number
  maxBase?: number
  minAdded?: number
  maxTotal?: number
  minBonus?: number
  maxBonus?: number
  labelClassName?: string
  totalClassName?: string
  total?: number
}

export const StatBlockEditor: React.FC<StatBlockEditorProps> = ({
  label,
  value,
  onChange,
  minBase = 0,
  maxBase = 5,
  minAdded = 0,
  maxTotal = 5,
  minBonus = 0,
  maxBonus = Infinity,
  labelClassName,
  totalClassName,
  total,
}) => {
  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const base = clamp(Number.parseInt(e.target.value) || 0, minBase, maxBase)
    const added = clamp(value.added, minAdded, Math.max(0, maxTotal - base))
    onChange({ ...value, base, added })
  }

  const handleAddedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxAdded = Math.max(0, maxTotal - value.base)
    const added = clamp(Number.parseInt(e.target.value) || 0, minAdded, maxAdded)
    onChange({ ...value, added })
  }

  const handleBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bonus = clamp(Number.parseInt(e.target.value) || 0, minBonus, maxBonus)
    onChange({ ...value, bonus })
  }

  return (
    <tr className="border-b border-gray-200">
      <td className={cn("py-2 px-3 font-medium capitalize", labelClassName)}>{label}</td>
      <td className="py-2 px-3">
        <Input
          type="number"
          value={value.base}
          onChange={handleBaseChange}
          className="w-16 text-center"
          min={minBase}
          max={maxBase}
        />
      </td>
      <td className="py-2 px-3">
        <Input
          type="number"
          value={value.added}
          onChange={handleAddedChange}
          className="w-16 text-center"
          min={minAdded}
          max={Math.max(0, maxTotal - value.base)}
        />
      </td>
      <td className="py-2 px-3">
        <Input
          type="number"
          value={value.bonus}
          onChange={handleBonusChange}
          className="w-16 text-center"
          min={minBonus}
          max={maxBonus === Infinity ? undefined : maxBonus}
        />
      </td>
      <td className={cn("py-2 px-3 font-bold text-center", totalClassName)}>
        {total ?? calculateStatTotal(value)}
      </td>
    </tr>
  )
}

export default StatBlockEditor
