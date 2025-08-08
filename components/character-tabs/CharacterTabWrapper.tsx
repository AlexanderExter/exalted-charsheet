import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Character } from "@/lib/character-types"
import { cn } from "@/lib/utils"

interface CharacterTabWrapperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  character: Character | null
  children: (character: Character) => React.ReactNode
}

export const CharacterTabWrapper: React.FC<CharacterTabWrapperProps> = ({
  character,
  className,
  children,
  ...props
}) => {
  if (!character) {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 italic">No character selected.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {children(character)}
    </div>
  )
}

export default CharacterTabWrapper

