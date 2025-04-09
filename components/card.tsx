"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Clock, ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import type { Card as CardType } from "./context/board-context";
import { useBoard } from "./context/board-context";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getColorFromName, getPriorityColor, formatDate } from "@/lib/utils";

interface CardProps {
  card: CardType;
  columnId: string;
  onClick: () => void;
}

export function Card({ card, columnId, onClick }: CardProps) {
  // Context
  const { deleteCard } = useBoard();

  // dnd-kit Sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completedItems = card.checklist.filter((item) => item.checked).length;
  const totalItems = card.checklist.length;


  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCard(columnId, card.id)
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-700 rounded-md border-2 border-gray-200 dark:border-gray-600 shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow relative group"
      onClick={
        (e) => {
          // dont show the card drawer if the click is on the delete button
          if (
            e.target instanceof HTMLElement &&
            !e.target.closest('button[data-delete-button="true"]')
          ) {
            onClick();
          }
        }
      }
    >
      {/* AlertDialog: delete card */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            data-delete-button="true"
            className="absolute top-1 right-1 h-6 w-6"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permenantly delete the card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {card.image && (
        <div className="mb-2 rounded overflow-hidden">
          <Image
            src={card.image || "/placeholder.svg"}
            alt="Card attachment"
            width={240}
            height={120}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      <h3 className="font-medium mb-1">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
          {card.description}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mb-2">
        {card.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          {card.priority && (
            <Badge
              variant="outline"
              className={`text-xs ${getPriorityColor(card.priority)}`}
            >
              {card.priority}
            </Badge>
          )}
          {totalItems > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              {completedItems}/{totalItems}
            </span>
          )}
          {card.image && <ImageIcon className="h-3 w-3" />}
        </div>
        <div className="flex items-center gap-2">
          {card.assignees && card.assignees.length > 0 && (
            <span className="flex items-center gap-1">
              {card.assignees.length === 1 ? (
                <Avatar className="h-5 w-5">
                  <AvatarFallback className={`${getColorFromName(card.assignees[0])} text-white text-xs`}>
                    {getInitials(card.assignees[0])}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <>
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-gray-500 text-white text-xs">
                      {card.assignees.length}
                    </AvatarFallback>
                  </Avatar>
                </>
              )}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(card.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
