import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ArmorPiece, Weapon } from "@/lib/character-types"

interface EquipmentTagReferenceProps {
  armor: ArmorPiece[]
  weapons: Weapon[]
}

export const EquipmentTagReference: React.FC<EquipmentTagReferenceProps> = ({
  armor,
  weapons,
}) => {
  const items = [...armor, ...weapons]
  const allTags = new Set<string>()
  items.forEach(item => {
    item.tags.forEach(tag => {
      const trimmed = tag.trim()
      if (trimmed) allTags.add(trimmed)
    })
  })
  const tags = Array.from(allTags)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Tag Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tags.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tags.sort().map((tag, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="font-medium text-gray-700">{tag}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Used on{" "}
                    {items
                      .filter(item => item.tags.includes(tag))
                      .map(item => item.name || "Unnamed")
                      .join(", ")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No equipment tags to reference.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

EquipmentTagReference.displayName = "EquipmentTagReference"

