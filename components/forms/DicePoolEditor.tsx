import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AttributeSelector from "./AttributeSelector";
import AbilitySelector from "./AbilitySelector";
import ModifierInputs from "./ModifierInputs";
import DicePoolSummary from "./DicePoolSummary";

export const DicePoolEditor: React.FC = React.memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roll Assembler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Pool Assembly</h3>
            <div className="space-y-3">
              <AttributeSelector />
              <AbilitySelector />
            </div>
          </div>
          <ModifierInputs />
        </div>
        <DicePoolSummary />
      </CardContent>
    </Card>
  );
});

DicePoolEditor.displayName = "DicePoolEditor";

export default DicePoolEditor;
