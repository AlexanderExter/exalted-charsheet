import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function NoCharacterCard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-500 italic">No character selected.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default NoCharacterCard;
