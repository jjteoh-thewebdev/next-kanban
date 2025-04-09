"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { type Card as CardType, useBoard } from "./context/board-context";
import { BoardHeader } from "./board-header";
import { Card } from "./card";
import { CardDrawer } from "./card-drawer";
import { Column } from "./column";
import { useIsMobile } from "@/hooks/use-mobile";

export function KanbanBoard() {
  // Add PointerSensor to dnd sensor(handle mouse, touch, pen/stylus)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // to distinguish between click and drag
      },
    })
  );

  const { board, addColumn, moveCard } = useBoard();
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<{
    card: CardType;
    columnId: string;
  } | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const isMobile = useIsMobile();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    const columnId = active.data.current?.columnId as string;

    const column = board.columns.find((col) => col.id === columnId);
    if (!column) return;

    const card = column.cards.find((c) => c.id === id);
    if (card) {
      setActiveCard(card);
      setActiveColumnId(columnId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If the card is not over a drop zone
    if (!overId) return;

    const activeColumnId = active.data.current?.columnId;
    const overColumnId = over.data.current?.columnId || over.id;

    // If the card is over the same column, do nothing
    if (activeColumnId === overColumnId) return;

    // If the card is over a different column, move it
    if (activeColumnId && typeof activeId === "string") {
      moveCard(activeColumnId, overColumnId as string, activeId);
    }
  };

  const handleDragEnd = () => {
    setActiveCard(null);
    setActiveColumnId(null);
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  const handleCardClick = (card: CardType, columnId: string) => {
    setSelectedCard({ card, columnId });
  };

  const handleCloseDrawer = () => {
    setSelectedCard(null);
  };

  return (
    <div
      className="min-h-screen overflow-hidden flex flex-col transition-colors"
      style={{
        background:
          board.background.type === "color"
            ? board.background.value
            : `url(${board.background.value}) center/cover no-repeat fixed`,
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="p-4">
        <BoardHeader />
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <div className={`h-full overflow-x-auto ${isMobile ? 'pb-20' : 'pb-4'}`}>
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <div className="flex items-start gap-4 h-full">
              {board.columns.map((column) => (
                <SortableContext
                  key={column.id}
                  items={column.cards.map((card) => card.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Column
                    key={column.id}
                    column={column}
                    onCardClick={handleCardClick}
                  />
                </SortableContext>
              ))}

              {isAddingColumn ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 w-80 shrink-0">
                  <Input
                    placeholder="Enter column title"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="mb-2"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn();
                      if (e.key === "Escape") setIsAddingColumn(false);
                    }}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddColumn}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingColumn(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="h-auto p-3 flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 w-80 justify-start shrink-0"
                  onClick={() => setIsAddingColumn(true)}
                >
                  <Plus className="h-5 w-5" />
                  Add Column
                </Button>
              )}
            </div>

            <DragOverlay>
              {activeCard && activeColumnId && (
                <div
                  className="w-[272px]"
                >
                  <Card
                    card={activeCard}
                    columnId={activeColumnId}
                    onClick={() => {
                      handleCardClick(activeCard, activeColumnId);
                    }}
                  />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {
        selectedCard && (
          <CardDrawer
            card={selectedCard?.card || null}
            columnId={selectedCard?.columnId || null}
            onClose={handleCloseDrawer}
          />
        )
      }
    
    </div>
  );
}
