"use client";

import { nanoid } from "nanoid";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useToast } from "../ui/use-toast";

export type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

export type Priority = "low" | "medium" | "high";

export type Card = {
  id: string;
  title: string;
  description: string;
  checklist: ChecklistItem[];
  image: string | null;
  priority: Priority;
  tags: string[];
  assignees: string[];
  createdAt: Date;
  updatedAt: Date;
  dueAt: Date | null;
};

export type Column = {
  id: string;
  title: string;
  cards: Card[];
};

export type Background = {
  type: "color" | "image";
  value: string;
};

export type BoardState = {
  columns: Column[];
  background: Background;
};

type BoardContextType = {
  board: BoardState;
  addColumn: (title: string) => void;
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;
  addCard: (columnId: string, card: Omit<Card, "id" | "createdAt" | "updatedAt">) => void;
  updateCard: (columnId: string, card: Card) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (fromColumnId: string, toColumnId: string, cardId: string) => void;
  updateBackground: (background: Background) => void;
};

// sample board
const initialBoard: BoardState = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      cards: [
        {
          id: nanoid(),
          title: "Research competitors",
          description: "Analyze top 5 competitors in the market",
          checklist: [
            { id: nanoid(), text: "Identify competitors", checked: true },
            { id: nanoid(), text: "Analyze features", checked: false },
          ],
          image: null,
          priority: "medium",
          tags: ["research", "marketing"],
          assignees: ["John Doe"],
          createdAt: new Date(),
          updatedAt: new Date(),
          dueAt: null,
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [
        {
          id: nanoid(),
          title: "Design homepage",
          description: "Create wireframes and mockups for the homepage",
          checklist: [
            { id: nanoid(), text: "Wireframes", checked: true },
            { id: nanoid(), text: "Mockups", checked: false },
            { id: nanoid(), text: "Get feedback", checked: false },
          ],
          image: null,
          priority: "high",
          tags: ["design", "ui"],
          assignees: ["Jane Smith", "Alan Tan"],
          createdAt: new Date(),
          updatedAt: new Date(),
          dueAt: null,
        },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      cards: [
        {
          id: nanoid(),
          title: "Setup project repository",
          description:
            "Initialize Git repository and setup basic project structure",
          checklist: [
            { id: nanoid(), text: "Initialize Git", checked: true },
            { id: nanoid(), text: "Setup folder structure", checked: true },
            { id: nanoid(), text: "Add README", checked: true },
          ],
          image: null,
          priority: "low",
          tags: ["setup", "dev"],
          assignees: ["Alex Wang", "Muhammad Ali"],
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(),
          dueAt: new Date(Date.now() - 86400000),
        },
      ],
    },
  ],
  background: {
    type: "color",
    value: "#f0f4f8",
  },
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const { toast } = useToast()

  const addColumn = (title: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, { id: nanoid(), title, cards: [] }],
    }));
  };

  const updateColumn = (id: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === id ? { ...col, title } : col
      ),
    }));
  };

  const deleteColumn = (id: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== id),
    }));
  };

  const addCard = (columnId: string, card: Omit<Card, "id" | "createdAt" | "updatedAt">) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: [
              ...col.cards,
              {
                ...card,
                id: nanoid(),
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          };
        }
        return col;
      }),
    }));
  };

  const updateCard = (columnId: string, updatedCard: Card) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: col.cards.map((card) =>
              card.id === updatedCard.id ? updatedCard : card
            ),
          };
        }
        return col;
      }),
    }));
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: col.cards.filter((card) => card.id !== cardId),
          };
        }
        return col;
      }),
    }));

    toast({
      title: "Card deleted",
      description: "Card deleted successfully",
    })
  };

  const moveCard = (
    fromColumnId: string,
    toColumnId: string,
    cardId: string
  ) => {
    setBoard((prev) => {
      const fromColumn = prev.columns.find((col) => col.id === fromColumnId);
      if (!fromColumn) return prev;

      const card = fromColumn.cards.find((c) => c.id === cardId);
      if (!card) return prev;

      return {
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === fromColumnId) {
            return {
              ...col,
              cards: col.cards.filter((c) => c.id !== cardId),
            };
          }
          if (col.id === toColumnId) {
            return {
              ...col,
              cards: [...col.cards, card],
            };
          }
          return col;
        }),
      };
    });
  };

  const updateBackground = (background: Background) => {
    setBoard((prev) => ({
      ...prev,
      background,
    }));
  };

  return (
    <BoardContext.Provider
      value={{
        board,
        addColumn,
        updateColumn,
        deleteColumn,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
        updateBackground,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
}
