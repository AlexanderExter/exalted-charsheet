"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AttributeSelector from "./AttributeSelector";
import AbilitySelector from "./AbilitySelector";
import ModifierInputs from "./ModifierInputs";
import DicePoolSummary from "./DicePoolSummary";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCharacterContext } from "@/hooks/CharacterContext";
import { dicePoolFormSchema, type DicePoolFormValues } from "@/lib/form-schemas";

export const DicePoolEditor: React.FC = React.memo(() => {
  const { character, updateCharacter } = useCharacterContext();
  const form = useForm<DicePoolFormValues>({
    resolver: zodResolver(dicePoolFormSchema),
    defaultValues: character.dicePool,
    mode: "onChange",
  });

  React.useEffect(() => {
    form.reset(character.dicePool);
  }, [character, form]);

  React.useEffect(() => {
    const subscription = form.watch(value => {
      if (form.formState.isValid) {
        updateCharacter({ dicePool: dicePoolFormSchema.parse(value) });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateCharacter]);

  return (
    <Form {...form}>
      <form onSubmit={e => e.preventDefault()}>
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
      </form>
    </Form>
  );
});

DicePoolEditor.displayName = "DicePoolEditor";

export default DicePoolEditor;
