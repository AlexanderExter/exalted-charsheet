import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { ArmorPiece, ArmorType } from "@/lib/character-types"

interface ArmorEditorProps {
  armor: ArmorPiece
  updateArmor: (
    id: string,
    field: keyof ArmorPiece,
    value: ArmorPiece[keyof ArmorPiece]
  ) => void
  deleteArmor: (id: string) => void
}

export const ArmorEditor: React.FC<ArmorEditorProps> = ({
  armor,
  updateArmor,
  deleteArmor,
}) => {
  const parseTagsFromString = (tagString: string): string[] =>
    tagString
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

  const stringifyTags = (tags: string[]): string => tags.join(", ")

  return (
    <div className="p-4 bg-white rounded border border-gray-200 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor={`armor-name-${armor.id}`}>Name</Label>
          <Input
            id={`armor-name-${armor.id}`}
            value={armor.name}
            onChange={e => updateArmor(armor.id, "name", e.target.value)}
            placeholder="Armor name..."
          />
        </div>
        <div>
          <Label htmlFor={`armor-type-${armor.id}`}>Type</Label>
          <Select
            value={armor.type}
            onValueChange={(value: ArmorType) => updateArmor(armor.id, "type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`armor-soak-${armor.id}`}>Soak</Label>
          <Input
            id={`armor-soak-${armor.id}`}
            type="number"
            value={armor.soak}
            onChange={e =>
              updateArmor(armor.id, "soak", Number.parseInt(e.target.value) || 0)
            }
            min={0}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor={`armor-hardness-${armor.id}`}>Hardness</Label>
          <Input
            id={`armor-hardness-${armor.id}`}
            type="number"
            value={armor.hardness}
            onChange={e =>
              updateArmor(
                armor.id,
                "hardness",
                Number.parseInt(e.target.value) || 0,
              )
            }
            min={0}
          />
        </div>
        <div>
          <Label htmlFor={`armor-mobility-${armor.id}`}>Mobility</Label>
          <Input
            id={`armor-mobility-${armor.id}`}
            type="number"
            value={armor.mobility}
            onChange={e =>
              updateArmor(
                armor.id,
                "mobility",
                Number.parseInt(e.target.value) || 0,
              )
            }
          />
        </div>
        <div>
          <Label htmlFor={`armor-tags-${armor.id}`}>Tags</Label>
          <Input
            id={`armor-tags-${armor.id}`}
            value={stringifyTags(armor.tags)}
            onChange={e =>
              updateArmor(armor.id, "tags", parseTagsFromString(e.target.value))
            }
            placeholder="e.g., Concealable, Balanced"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`armor-description-${armor.id}`}>Description</Label>
        <Textarea
          id={`armor-description-${armor.id}`}
          value={armor.description || ""}
          onChange={e => updateArmor(armor.id, "description", e.target.value)}
          placeholder="Armor description and special properties..."
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button onClick={() => deleteArmor(armor.id)} size="sm" variant="destructive">
          Delete
        </Button>
      </div>
    </div>
  )
}

ArmorEditor.displayName = "ArmorEditor"

