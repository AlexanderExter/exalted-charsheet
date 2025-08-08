import React, { useState } from "react"
import { EssenceEditor } from "./EssenceEditor"
import type { Essence } from "@/lib/character-types"

const meta = { title: "Components/EssenceEditor", component: EssenceEditor }
export default meta

export const Basic = () => {
  const [essence, setEssence] = useState<Essence>({
    rating: 1,
    motes: 5,
    commitments: 0,
    spent: 0,
    anima: 0,
  })

  return <EssenceEditor essence={essence} onChange={setEssence} />
}
