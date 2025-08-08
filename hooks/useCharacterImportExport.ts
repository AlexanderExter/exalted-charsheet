import { useRef, useCallback } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { createNewCharacter } from "@/lib/character-defaults"
import type { Character } from "@/lib/character-types"

interface UseCharacterImportExportProps {
  characters: Character[]
  loadCharacters: (chars: Character[]) => void
  setCurrentCharacter: (id: string) => void
  setShowCharacterSelect: (show: boolean) => void
}

export const useCharacterImportExport = ({
  characters,
  loadCharacters,
  setCurrentCharacter,
  setShowCharacterSelect,
}: UseCharacterImportExportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportCharacter = useCallback((character: Character) => {
    try {
      const dataStr = JSON.stringify(character, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${character.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_exalted_character.json`
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
    } catch {
      toast.error("Failed to export character. Please try again.")
    }
  }, [])

  const importCharacter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = e => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          const isArray = Array.isArray(importedData)
          const charactersToImport = isArray ? importedData : [importedData]

          const validatedCharacters = charactersToImport.map((char: Partial<Character>) => {
            if (!char.name) {
              throw new Error("Invalid character data: missing name")
            }

            return {
              ...createNewCharacter(char.name),
              ...char,
              id: uuidv4(),
            }
          })

          loadCharacters([...characters, ...validatedCharacters])

          if (validatedCharacters.length === 1) {
            setCurrentCharacter(validatedCharacters[0].id)
            setShowCharacterSelect(false)
          }

          event.target.value = ""
          toast.success(`Successfully imported ${validatedCharacters.length} character(s)`)
        } catch {
          toast.error(
            "Failed to import character(s). Please ensure the file is a valid character export."
          )
          event.target.value = ""
        }
      }

      reader.readAsText(file)
    },
    [characters, loadCharacters, setCurrentCharacter, setShowCharacterSelect]
  )

  return { exportCharacter, importCharacter, fileInputRef }
}

export default useCharacterImportExport
