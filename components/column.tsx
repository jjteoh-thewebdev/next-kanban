"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "./card"
import { type Column as ColumnType, useBoard, type Card as CardType } from "./context/board-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Plus, Trash2, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ColumnProps {
  column: ColumnType
  onCardClick: (card: CardType, columnId: string) => void
}

export function Column({ column, onCardClick }: ColumnProps) {
  const { updateColumn, deleteColumn, addCard } = useBoard()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
    data: {
      type: "column",
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleTitleSave = () => {
    if (title.trim()) {
      updateColumn(column.id, title)
    } else {
      setTitle(column.title)
    }
    setIsEditing(false)
  }

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(column.id, {
        title: newCardTitle,
        description: "",
        checklist: [],
        image: null,
        priority: "medium",
        tags: [],
        assignee: null,
      })
      setNewCardTitle("")
      setIsAddingCard(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 w-80 shrink-0 flex flex-col h-full max-h-full"
    >
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        {isEditing ? (
          <div className="flex w-full gap-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave()
                if (e.key === "Escape") {
                  setTitle(column.title)
                  setIsEditing(false)
                }
              }}
              onBlur={handleTitleSave}
              className="h-7 py-1"
            />
          </div>
        ) : (
          <div
            className="font-medium text-lg cursor-pointer px-1 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex-grow"
            onClick={() => setIsEditing(true)}
            {...attributes}
            {...listeners}
          >
            {column.title}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Column actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>Rename</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => deleteColumn(column.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-y-auto flex-grow pr-1 -mr-1">
        {column.cards.map((card) => (
          <Card key={card.id} card={card} columnId={column.id} onClick={() => 
            onCardClick(card, column.id)
          } />
        ))}
      </div>

      <div className="mt-2 flex-shrink-0">
        {isAddingCard ? (
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <Input
              placeholder="Enter card title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard()
                if (e.key === "Escape") setIsAddingCard(false)
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCard}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAddingCard(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" className="w-full justify-start" onClick={() => setIsAddingCard(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Card
          </Button>
        )}
      </div>
    </div>
  )
}
