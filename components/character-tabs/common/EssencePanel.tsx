import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EssenceEditor } from "@/components/EssenceEditor";
import { getAnimaLevel, getActiveAnimaRulings } from "@/lib/exalted-utils/anima";
import type { Essence } from "@/lib/character-types";

interface EssencePanelProps {
  essence: Essence;
  onChange: (essence: Essence) => void;
}

export const EssencePanel: React.FC<EssencePanelProps> = ({ essence, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Essence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <EssenceEditor essence={essence} onChange={onChange} />

          <div className="space-y-4">
            {/* Anima Slider */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Anima Level</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Dim</span>
                  <span>Burning</span>
                  <span>Bonfire</span>
                  <span>Iconic</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={essence.anima || 0}
                  onChange={e => onChange({ ...essence, anima: Number.parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2 h-6 flex justify-between text-xs text-gray-600">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={i} className="relative w-0">
                      <div className="w-px h-2 bg-gray-400" />
                      <span className="absolute top-2 left-1/2 -translate-x-1/2">{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Anima Effects */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Level:</span>
                <Badge variant="secondary">{getAnimaLevel(essence.anima || 0)}</Badge>
              </div>
              {getActiveAnimaRulings(essence.anima || 0).length > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-purple-700 mb-2">Active Effects:</div>
                  {getActiveAnimaRulings(essence.anima || 0).map((ruling, index) => (
                    <div key={index} className="text-sm text-purple-600">
                      • {ruling}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

EssencePanel.displayName = "EssencePanel";

export default EssencePanel;
