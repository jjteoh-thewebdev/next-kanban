"use client";

import { BoardProvider } from "@/components/board-context";
import { KanbanBoard } from "@/components/kanban-board";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <BoardProvider>
      <KanbanBoard />
    </BoardProvider>
  );
}
