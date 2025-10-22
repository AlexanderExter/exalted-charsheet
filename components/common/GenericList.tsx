"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableList } from "@/components/common/SortableList";

interface GenericListProps<T extends { id: string }> {
  title: string;
  items: T[];
  emptyMessage?: string;
  addButtonText?: string;
  buttonColor?: string;
  onAdd: () => void;
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
}

export function GenericList<T extends { id: string }>({
  title,
  items,
  emptyMessage = "No items yet.",
  addButtonText = "Add Item",
  buttonColor = "bg-gray-600 hover:bg-gray-700",
  onAdd,
  onReorder,
  renderItem,
}: GenericListProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Button onClick={onAdd} size="sm" className={buttonColor}>
            <Plus className="w-4 h-4 mr-1" />
            {addButtonText}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground/80 italic">{emptyMessage}</p>
        ) : (
          <SortableList items={items} onReorder={onReorder} renderItem={renderItem} />
        )}
      </CardContent>
    </Card>
  );
}

// Memoized version for performance
export const GenericListMemo = React.memo(GenericList) as typeof GenericList;
