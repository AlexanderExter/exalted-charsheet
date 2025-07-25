// WIP Tab Component - Work in Progress and experimental features

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CombatStep {
  step: number
  defaultActions: string[]
}

const COMBAT_STEPS: CombatStep[] = [
  {
    step: 1,
    defaultActions: ["Move", "Decisive Attack", "Withering Attack", "Activate Excellence"],
  },
  { step: 2, defaultActions: [] },
  { step: 3, defaultActions: [] },
  { step: 4, defaultActions: [] },
  { step: 5, defaultActions: [] },
  { step: 6, defaultActions: [] },
  { step: 7, defaultActions: [] },
  { step: 8, defaultActions: [] },
]

export const WIPTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
        <div className="font-semibold mb-1">Work In Progress</div>
        <div>This tab contains experimental features that are still being developed.</div>
      </div>
      
      {/* Combat Steps Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Combat Turn Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {COMBAT_STEPS.map((step) => (
              <div key={step.step} className="p-3 bg-white rounded border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Step {step.step}</h3>
                <div className="space-y-1">
                  {step.defaultActions.length > 0 ? (
                    step.defaultActions.map((action, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {action}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 italic">
                      No default actions defined
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Note: This component will eventually allow dynamic addition of available actions per step based on
            character abilities and current combat situation.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}